# ファイルアップロード機能の実装例
import streamlit as st
import tempfile
import os
from barfi.flow import Block, ComputeEngine
from barfi.flow.streamlit import st_flow


# st.set_page_config(layout="wide", initial_sidebar_state="collapsed")
st.set_page_config(layout="wide")

# セッションステートでアップロードされたファイルパスを管理
if "uploaded_file_path" not in st.session_state:
    st.session_state.uploaded_file_path = ""

# サイドバーでファイルアップロード
with st.sidebar:
    st.header("📁 ファイルアップロード")
    uploaded_file = st.file_uploader(
        "ファイルを選択",
        type=["txt", "csv", "json", "log", "xlsx", "jpg", "jpeg", "png"],
        help="アップロードしたファイルはサーバーに保存され、フルパスが取得できます",
    )

    if uploaded_file is not None:
        # 一時ディレクトリに保存
        temp_dir = tempfile.gettempdir()
        file_path = os.path.join(temp_dir, uploaded_file.name)

        with open(file_path, "wb") as f:
            f.write(uploaded_file.getbuffer())

        st.session_state.uploaded_file_path = file_path

        st.success(f"✅ {uploaded_file.name}")
        st.info(f"サイズ: {uploaded_file.size / 1024:.2f} KB")
    else:
        st.info("ファイルが選択されていません")

# File Source ブロック - アップロードされたファイルパスを出力
file_source_block = Block(name="File Source")
file_source_block.add_output(name="File Path")
file_source_block.add_option(
    name="display-option",
    type="display",
    value="サイドバーからアップロードされたファイルのパスを出力します",
)


def file_source_block_func(self):
    file_path = st.session_state.uploaded_file_path
    self.set_interface(name="File Path", value=file_path)
    if file_path:
        print(f"Uploaded file path: {file_path}")


file_source_block.add_compute(file_source_block_func)

# Display ブロック - 値を表示
display_block = Block(name="Display")
display_block.add_input(name="Input")
display_block.add_option(
    name="display-option",
    type="display",
    value="接続されたブロックの値を表示します",
)


def display_block_func(self):
    value = self.get_interface(name="Input")
    print(value)


display_block.add_compute(display_block_func)

# st_flow にベースブロックを渡し、スキーマを生成します
base_blocks = [
    file_source_block,
    display_block,
]
barfi_result = st_flow(base_blocks, commands=["execute"])

# base_blocks を使って ComputeEngine（計算エンジン）を初期化し、スキーマを実行します
compute_engine = ComputeEngine(base_blocks)

# barfi_result から flow_schema（フロースキーマ）を参照します
flow_schema = barfi_result.editor_schema
compute_engine.execute(flow_schema)

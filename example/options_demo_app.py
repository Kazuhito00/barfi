# オプションタイプのデモ - 各種入力ブロックの実装例
import streamlit as st
from barfi.flow import Block, ComputeEngine
from barfi.flow.streamlit import st_flow


st.set_page_config(layout="wide", initial_sidebar_state="collapsed")

# Number ブロック - 小数入力
number_block = Block(name="Number (Decimal)")
number_block.add_output(name="Output")
number_block.add_option(
    name="display-option",
    type="display",
    value="小数を入力できます",
)
number_block.add_option(name="number-option", type="number", value=3.14)


def number_block_func(self):
    number_value = self.get_option(name="number-option")
    self.set_interface(name="Output", value=number_value)


number_block.add_compute(number_block_func)

# Integer ブロック - 整数入力
integer_block = Block(name="Integer")
integer_block.add_output(name="Output")
integer_block.add_option(name="integer-option", type="integer", value=42)
integer_block.add_option(
    name="display-option", type="display", value="整数を入力できます"
)


def integer_block_func(self):
    integer_value = self.get_option(name="integer-option")
    self.set_interface(name="Output", value=integer_value)


integer_block.add_compute(integer_block_func)

# Text Input ブロック - テキスト入力フィールド
input_block = Block(name="Text Input")
input_block.add_output(name="Output")
input_block.add_option(name="input-option", type="input", value="サンプルテキスト")
input_block.add_option(
    name="display-option", type="display", value="テキストを入力できます"
)


def input_block_func(self):
    input_value = self.get_option(name="input-option")
    self.set_interface(name="Output", value=input_value)


input_block.add_compute(input_block_func)

# Checkbox ブロック - ブールトグル
checkbox_block = Block(name="Checkbox")
checkbox_block.add_output(name="Output")
checkbox_block.add_option(name="checkbox-option", type="checkbox", value=True)
checkbox_block.add_option(
    name="display-option",
    type="display",
    value="チェックボックスでブール値を切り替えます",
)


def checkbox_block_func(self):
    checkbox_value = self.get_option(name="checkbox-option")
    self.set_interface(name="Output", value=checkbox_value)


checkbox_block.add_compute(checkbox_block_func)

# Select ブロック - ドロップダウン選択
select_block = Block(name="Select")
select_block.add_output(name="Output")
select_block.add_option(
    name="select-option",
    type="select",
    value="オプション1",
    items=["オプション1", "オプション2", "オプション3", "オプション4"],
)
select_block.add_option(
    name="display-option", type="display", value="ドロップダウンから選択できます"
)


def select_block_func(self):
    select_value = self.get_option(name="select-option")
    self.set_interface(name="Output", value=select_value)


select_block.add_compute(select_block_func)

# Slider ブロック - 範囲スライダー
slider_block = Block(name="Slider")
slider_block.add_output(name="Output")
slider_block.add_option(
    name="slider-option", type="slider", value=50, min=0, max=100, step=5
)
slider_block.add_option(
    name="display-option", type="display", value="スライダーで値を調整できます (0-100)"
)


def slider_block_func(self):
    slider_value = self.get_option(name="slider-option")
    self.set_interface(name="Output", value=slider_value)


slider_block.add_compute(slider_block_func)

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
    number_block,
    integer_block,
    input_block,
    checkbox_block,
    select_block,
    slider_block,
    display_block,
]
barfi_result = st_flow(base_blocks, commands=["execute"])

# base_blocks を使って ComputeEngine（計算エンジン）を初期化し、スキーマを実行します
compute_engine = ComputeEngine(base_blocks)

# barfi_result から flow_schema（フロースキーマ）を参照します
flow_schema = barfi_result.editor_schema
compute_engine.execute(flow_schema)

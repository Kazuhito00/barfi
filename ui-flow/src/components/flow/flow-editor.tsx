import { useCallback } from "react";
import { Streamlit } from "streamlit-component-lib";
import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";
import {
    ReactFlowProvider,
    ReactFlow,
    Background,
    MiniMap,
    Controls,
    Panel,
    addEdge,
    Edge,
    Node,
    OnNodesChange,
    OnEdgesChange,
    OnConnect,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import PanelContextMenu from "@/components/flow/context-menu";
import PanelRun from "@/components/flow/panel-run";
import { useFlowStateStore } from "@/components/flow/flow-state";
import { BaseBlockNode } from "@/components/nodes";
import { v4 as uuid } from "uuid";
import { BaseBlock } from "@/types";

export default function FlowEditor({
    nodes,
    edges,
    setEdges,
    onNodesChange,
    onEdgesChange,
    baseBlocks,
}: {
    nodes: Node[];
    edges: Edge[];
    setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
    onNodesChange: OnNodesChange<Node>;
    onEdgesChange: OnEdgesChange<Edge>;
    baseBlocks: BaseBlock[] | Record<string, BaseBlock[]>;
}) {
    const setContextLocation = useFlowStateStore(
        (state) => state.setContextLocation
    );
    const delNodeFromStore = useFlowStateStore((state) => state.delNode);

    const onConnect: OnConnect = useCallback(
        (params) =>
            setEdges((eds) => {
                // Check if the target input already has a connection
                const existingConnection = eds.find(
                    (edge) =>
                        edge.target === params.target &&
                        edge.targetHandle === params.targetHandle
                );

                // If an input already has a connection, remove it before adding the new one
                // This ensures only one output can be connected to an input at a time
                if (existingConnection) {
                    const filteredEdges = eds.filter(
                        (edge) => edge.id !== existingConnection.id
                    );
                    return addEdge(
                        { ...params, animated: true, id: `edge__${uuid()}` },
                        filteredEdges
                    );
                }

                // No existing connection, just add the new edge
                return addEdge(
                    { ...params, animated: true, id: `edge__${uuid()}` },
                    eds
                );
            }),
        [setEdges]
    );

    const onPanelContextClick = useCallback(
        (e: React.MouseEvent) => {
            setContextLocation(e.clientX, e.clientY);
        },
        [setContextLocation]
    );

    return (
        <ReactFlowProvider>
            <ContextMenu>
                <ContextMenuTrigger asChild>
                    <ReactFlow
                        nodeTypes={{ baseBlock: BaseBlockNode }}
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onContextMenu={onPanelContextClick}
                        fitView={true}
                        fitViewOptions={{ padding: 0.75 }}
                        proOptions={{ hideAttribution: true }}
                        nodesDraggable
                        minZoom={0}
                        onDelete={({ nodes }) => {
                            nodes.forEach((node) => {
                                delNodeFromStore(node.id);
                            });
                        }}
                    >
                        <Background color="#aaa" gap={16} />
                        <MiniMap position="top-right" />
                        <Controls position="top-left" />
                        <Panel position="bottom-right">
                            <PanelRun
                                onClickRun={Streamlit.setComponentValue}
                            />
                        </Panel>
                    </ReactFlow>
                </ContextMenuTrigger>
                <PanelContextMenu baseBlocks={baseBlocks} />
            </ContextMenu>
        </ReactFlowProvider>
    );
}

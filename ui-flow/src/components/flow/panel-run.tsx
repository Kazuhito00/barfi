import { useReactFlow, Node, Edge, Viewport } from "@xyflow/react";
import { useFlowStateStore } from "@/components/flow/flow-state";
import {
    BaseBlock,
    BlockOption,
    FlowStateNode,
    FlowStateConnection,
} from "@/types";
import { PlayIcon, StarIcon } from "@radix-ui/react-icons";

function constructFlowState(
    nodes: Node[],
    edges: Edge[],
    viewport: Viewport,
    nodesOptionData: Record<string, Record<string, BlockOption>>
) {
    const flowStateNodes: FlowStateNode[] = nodes.map((node) => {
        const blockData = node.data.blockData as BaseBlock;
        return {
            id: node.id,
            name: blockData.name,
            type: blockData.type,
            label: blockData.label || "",
            inputs: blockData.inputs.map((input) => ({
                name: input.name,
                itype: input.itype,
            })),
            outputs: blockData.outputs.map((output) => ({
                name: output.name,
                itype: output.itype,
            })),
            options: blockData.options.map((option) => ({
                name: option.name,
                value: nodesOptionData[node.id][option.name].value,
            })),
            position: node.position,
            measured: node.measured || { width: 0, height: 0 },
        };
    });
    const flowStateConnections: FlowStateConnection[] = edges.map((edge) => {
        return {
            id: edge.id,
            outputNode: edge.source,
            outputNodeInterface: edge.sourceHandle ?? "",
            inputNode: edge.target,
            inputNodeInterface: edge.targetHandle ?? "",
        };
    });
    return {
        nodes: flowStateNodes,
        connections: flowStateConnections,
        viewport: viewport,
    };
}

// Map command names to their display properties
const commandConfig: Record<string, { label: string; icon: React.ReactNode }> = {
    execute: {
        label: "Execute",
        icon: <PlayIcon className="w-3.5 h-3.5" />,
    },
    save: {
        label: "Save",
        icon: <StarIcon className="w-3.5 h-3.5" />,
    },
};

export default function PanelRun({
    onClickRun,
    commands = ["execute", "save"],
}: {
    onClickRun: ({
        command,
        editor_schema,
    }: {
        command: string;
        editor_schema: {
            nodes: FlowStateNode[];
            connections: FlowStateConnection[];
            viewport: Viewport;
        };
    }) => void;
    commands?: string[];
}) {
    const { getNodes, getEdges, getViewport } = useReactFlow();
    const getNodesOptionDataFromStore = useFlowStateStore(
        (state) => state.getNodesOptionData
    );

    const handleCommand = (command: string) => {
        onClickRun({
            command: command,
            editor_schema: constructFlowState(
                getNodes(),
                getEdges(),
                getViewport(),
                getNodesOptionDataFromStore()
            ),
        });
    };

    return (
        <div className="flex flex-row gap-2 text-sm text-white">
            {commands.map((command) => {
                const config = commandConfig[command];
                if (!config) return null;

                return (
                    <button
                        key={command}
                        className="flex items-center px-2 py-1 rounded-sm shadow-md bg-gray-600 gap-1"
                        onClick={() => handleCommand(command)}
                    >
                        <span>{config.icon}</span>
                        <span>{config.label}</span>
                    </button>
                );
            })}
        </div>
    );
}

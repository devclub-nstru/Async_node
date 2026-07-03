"use client";
import {useEffect, useRef, useState} from "react";
import {useParams, useRouter} from "next/navigation";
import {notFound} from "next/navigation";
import type {Node} from "reactflow";
import {useMe} from "@/hooks/useMe";
import {useWorkflow} from "@/hooks/useWorkflow";
import BuilderTopbar from "@/components/builder/BuilderTopbar";
import NodeSidebar from "@/components/builder/NodeSidebar";
import BuilderCanvas, {type BuilderCanvasHandle} from "@/components/builder/BuilderCanvas";
import NodeConfigPanel from "@/components/builder/NodeConfigPanel";
export default function builder() {
    const { user,loading,route } = useMe()
    const params = useParams<{ id: string }>()
    const {workflow,loading:workflowLoading,notFound:workflowNotFound} = useWorkflow(params.id)
    const [saving, setSaving] = useState(false)
    const [selectedNode, setSelectedNode] = useState<Node | null>(null)
    const canvasRef = useRef<BuilderCanvasHandle | null>(null)

    const router = useRouter()

    function handleSave() {
        setSaving(true)
        setTimeout(() => setSaving(false), 600)
    }

    function handleNodeDataChange(nodeId: string, data: Record<string, unknown>) {
        canvasRef.current?.updateNodeData(nodeId, data)
        setSelectedNode((prev) => (prev && prev.id === nodeId ? { ...prev, data } : prev))
    }

    useEffect(() => {
        if (route) {
            router.push("/signin")
        }
        if(user?.isVerified === false){
            router.push(`/verification/${user.email}`)
        }
    }, [route,user])

    if (loading || workflowLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#0a0a0d]">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-white/50" />
            </div>
        )
    }

    if (workflowNotFound) {
        notFound()
    }

    return(
        <div className="flex h-screen flex-col bg-[#0a0a0d]">
            <BuilderTopbar workflowName={workflow?.name} saving={saving} onSave={handleSave} />
            <div className="flex min-h-0 flex-1">
                <BuilderCanvas canvasRef={canvasRef} onSelectNode={setSelectedNode} />
                {selectedNode ? (
                    <NodeConfigPanel
                        node={selectedNode}
                        onChange={handleNodeDataChange}
                        onClose={() => setSelectedNode(null)}
                    />
                ) : (
                    <NodeSidebar />
                )}
            </div>
        </div>
    )
}
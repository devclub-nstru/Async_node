"use client"

import { useEffect, useRef, useState } from 'react'
import { io, type Socket } from 'socket.io-client'
import { config } from '@/config/config'

export type NodeRunStatus = 'running' | 'success' | 'failed'

type ExecutionEvent = {
    type: 'node:running' | 'node:success' | 'node:failed' | 'execution:started' | 'execution:finished'
    executionId: string
    workflowId: string
    nodeId?: string
    data?: unknown
    error?: string
}

function backendOrigin() {
    return config.backend_URI.replace(/\/api\/?$/, '')
}

export function useExecutionSocket(workflowId: number | string | undefined) {
    const [nodeStatuses, setNodeStatuses] = useState<Record<string, NodeRunStatus>>({})
    const [nodeResponses, setNodeResponses] = useState<Record<string, unknown>>({})
    const [activeExecutions, setActiveExecutions] = useState<Set<string>>(new Set())
    const socketRef = useRef<Socket | null>(null)

    useEffect(() => {
        if (!workflowId) return

        const socket = io(backendOrigin(), {
            path: '/ws/executions',
            query: { workflowId: String(workflowId) },
            withCredentials: true,
        })
        socketRef.current = socket

        socket.on('execution:event', (event: ExecutionEvent) => {
            if (event.type === 'execution:started') {
                setActiveExecutions((prev) => {
                    const next = new Set(prev)
                    next.add(event.executionId)
                    return next
                })
                setNodeStatuses({})
                setNodeResponses({})
                return
            }

            if (event.type === 'execution:finished') {
                setActiveExecutions((prev) => {
                    const next = new Set(prev)
                    next.delete(event.executionId)
                    return next
                })
                return
            }

            if (!event.nodeId) return

            if (event.type === 'node:running') {
                setNodeStatuses((prev) => ({ ...prev, [event.nodeId!]: 'running' }))
            } else if (event.type === 'node:success') {
                setNodeStatuses((prev) => ({ ...prev, [event.nodeId!]: 'success' }))
                if (event.data !== undefined) {
                    setNodeResponses((prev) => ({ ...prev, [event.nodeId!]: event.data }))
                }
            } else if (event.type === 'node:failed') {
                setNodeStatuses((prev) => ({ ...prev, [event.nodeId!]: 'failed' }))
                if (event.error) {
                    setNodeResponses((prev) => ({ ...prev, [event.nodeId!]: { error: event.error } }))
                }
            }
        })

        return () => {
            socket.disconnect()
            socketRef.current = null
        }
    }, [workflowId])

    return { nodeStatuses, nodeResponses, isExecuting: activeExecutions.size > 0 }
}

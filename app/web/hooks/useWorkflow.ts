import { useState, useEffect } from 'react';
import axios from 'axios';
import api from '@/lib/api';
import type { WorkflowItem } from '@/components/dashboard/types';
export function useWorkflow(workflowId: number | string) {
    const [workflow, setWorkflow] = useState<WorkflowItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        const fetchWorkflow = async () => {
            try {
                const response = await api.get(`/v1/workflows/workflows/${workflowId}`);
                setWorkflow(response.data.data);
            } catch (err) {
                if (axios.isAxiosError(err) && err.response?.status === 404) {
                    setNotFound(true);
                } else {
                    setError('Failed to load workflow');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchWorkflow();
    }, [workflowId]);

    return { workflow, loading, error, notFound };

}
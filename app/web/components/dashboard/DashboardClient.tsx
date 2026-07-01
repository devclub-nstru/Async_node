"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/api"
import { toast } from "sonner"
import { MOCK_WORKFLOWS, PAGE_SIZE } from "./types"
import DashboardBackground from "./DashboardBackground"
import DashboardHeader from "./DashboardHeader"
import WorkflowStats from "./WorkflowStats"
import WorkflowToolbar from "./WorkflowToolbar"
import WorkflowTable from "./WorkflowTable"
import WorkflowPagination from "./WorkflowPagination"


interface User {
  id: string
  email: string
  name?: string
  isVerified?: boolean
}

interface DashboardClientProps {
  user: User | null
}

export default function DashboardClient({ user }: DashboardClientProps) {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [signingOut, setSigningOut] = useState(false)

  const filtered = useMemo(
    () => MOCK_WORKFLOWS.filter((w) =>
      w.name.toLowerCase().includes(search.toLowerCase()) ||
      w.description.toLowerCase().includes(search.toLowerCase())
    ),
    [search],
  )
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value)
    setPage(1)
  }

  async function handleSignOut() {
    setSigningOut(true)
    try {
      console.log(user)
      await api.post("/v1/auth/signout")
      router.push("/signin")
    } catch {
      toast.error("Failed to sign out. Please try again.")
    } finally {
      setSigningOut(false)
    }
  }



  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#060608] text-[#f0eee9]">

      <DashboardBackground />

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-8">
        <DashboardHeader signingOut={signingOut} onSignOut={handleSignOut} />
        <WorkflowStats workflows={MOCK_WORKFLOWS} />
        <WorkflowToolbar
          search={search}
          onSearch={handleSearch}
          onCreateClick={() => toast.info("Create workflow — coming soon!")}
        />
        <WorkflowTable workflows={paginated} />
        <WorkflowPagination
          page={page}
          totalPages={totalPages}
          filteredCount={filtered.length}
          onPageChange={setPage}
        />
      </div>
    </div>
  )
}

/*
  Warnings:

  - You are about to drop the `AgentConfig` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "AgentConfig";

-- CreateTable
CREATE TABLE "agent_config" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tools" TEXT[],
    "role" TEXT NOT NULL,
    "memoryEnabled" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agent_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_run" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "task" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "agent_run_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "agent_run" ADD CONSTRAINT "agent_run_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "agent_config"("id") ON DELETE CASCADE ON UPDATE CASCADE;

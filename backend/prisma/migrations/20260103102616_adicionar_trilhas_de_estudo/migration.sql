-- CreateTable
CREATE TABLE "StudyTrack" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "level" TEXT NOT NULL DEFAULT 'Iniciante',
    "status" TEXT NOT NULL DEFAULT 'EM_ANDAMENTO',
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudyTrack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudyModule" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "trackId" TEXT NOT NULL,

    CONSTRAINT "StudyModule_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StudyTrack" ADD CONSTRAINT "StudyTrack_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudyModule" ADD CONSTRAINT "StudyModule_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "StudyTrack"("id") ON DELETE CASCADE ON UPDATE CASCADE;

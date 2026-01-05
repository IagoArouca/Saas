-- CreateTable
CREATE TABLE "RecruiterProfile" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "fullName" TEXT,
    "avatar" TEXT,
    "bannerUrl" TEXT,
    "bio" TEXT,
    "role" TEXT,
    "companyName" TEXT,
    "companySize" TEXT,
    "location" TEXT,
    "linkedinUrl" TEXT,
    "websiteUrl" TEXT,
    "technologies" TEXT[],
    "benefits" TEXT[],
    "hiringProcess" TEXT,
    "companyValues" TEXT,
    "experienceYears" INTEGER DEFAULT 0,
    "hiringStats_count" INTEGER DEFAULT 0,
    "hiringStats_projects" INTEGER DEFAULT 0,
    "hiringStats_time" INTEGER DEFAULT 0,
    "userId" TEXT NOT NULL,

    CONSTRAINT "RecruiterProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RecruiterProfile_username_key" ON "RecruiterProfile"("username");

-- CreateIndex
CREATE UNIQUE INDEX "RecruiterProfile_userId_key" ON "RecruiterProfile"("userId");

-- AddForeignKey
ALTER TABLE "RecruiterProfile" ADD CONSTRAINT "RecruiterProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

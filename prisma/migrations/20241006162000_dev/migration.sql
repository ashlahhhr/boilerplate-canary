-- CreateTable
CREATE TABLE "Perfume" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "baseNote" TEXT NOT NULL,
    "middleNote" TEXT NOT NULL,
    "topNote" TEXT NOT NULL,
    "smellDescription" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "occasion" TEXT NOT NULL,
    "dayTime" TEXT NOT NULL,
    "season" TEXT NOT NULL
);

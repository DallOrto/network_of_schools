import { timeToMinutes, timesOverlap, hasScheduleConflict } from "../../../src/utils/scheduleConflict";
import { Class, WeekDays } from "@prisma/client";

function makeClass(overrides: Partial<Class>): Class {
  return {
    id: "id",
    name: "Turma",
    classDay: WeekDays.Monday,
    startTime: "08:00",
    endTime: "10:00",
    maxStudents: 30,
    schoolId: "school-id",
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    ...overrides
  };
}

describe("timeToMinutes", () => {
  it("converts 00:00 to 0", () => {
    expect(timeToMinutes("00:00")).toBe(0);
  });

  it("converts 08:00 to 480", () => {
    expect(timeToMinutes("08:00")).toBe(480);
  });

  it("converts 10:30 to 630", () => {
    expect(timeToMinutes("10:30")).toBe(630);
  });

  it("converts 23:59 to 1439", () => {
    expect(timeToMinutes("23:59")).toBe(1439);
  });
});

describe("timesOverlap", () => {
  it("returns true when times fully overlap", () => {
    expect(timesOverlap("08:00", "10:00", "08:00", "10:00")).toBe(true);
  });

  it("returns true when second interval starts inside first", () => {
    expect(timesOverlap("08:00", "10:00", "09:00", "11:00")).toBe(true);
  });

  it("returns true when second interval is fully inside first", () => {
    expect(timesOverlap("08:00", "12:00", "09:00", "11:00")).toBe(true);
  });

  it("returns false when intervals are adjacent (end equals start)", () => {
    expect(timesOverlap("08:00", "10:00", "10:00", "12:00")).toBe(false);
  });

  it("returns false when first ends before second starts", () => {
    expect(timesOverlap("08:00", "09:00", "10:00", "11:00")).toBe(false);
  });

  it("returns false when second ends before first starts", () => {
    expect(timesOverlap("10:00", "12:00", "08:00", "09:00")).toBe(false);
  });
});

describe("hasScheduleConflict", () => {
  it("returns false when classes are on different days", () => {
    const class1 = makeClass({ classDay: WeekDays.Monday, startTime: "08:00", endTime: "10:00" });
    const class2 = makeClass({ classDay: WeekDays.Tuesday, startTime: "08:00", endTime: "10:00" });
    expect(hasScheduleConflict(class1, class2)).toBe(false);
  });

  it("returns true when classes on same day have overlapping times", () => {
    const class1 = makeClass({ classDay: WeekDays.Monday, startTime: "08:00", endTime: "10:00" });
    const class2 = makeClass({ classDay: WeekDays.Monday, startTime: "09:00", endTime: "11:00" });
    expect(hasScheduleConflict(class1, class2)).toBe(true);
  });

  it("returns false when classes on same day have adjacent times", () => {
    const class1 = makeClass({ classDay: WeekDays.Monday, startTime: "08:00", endTime: "10:00" });
    const class2 = makeClass({ classDay: WeekDays.Monday, startTime: "10:00", endTime: "12:00" });
    expect(hasScheduleConflict(class1, class2)).toBe(false);
  });

  it("returns false when classes on same day have no overlap", () => {
    const class1 = makeClass({ classDay: WeekDays.Friday, startTime: "08:00", endTime: "09:00" });
    const class2 = makeClass({ classDay: WeekDays.Friday, startTime: "10:00", endTime: "11:00" });
    expect(hasScheduleConflict(class1, class2)).toBe(false);
  });
});

import { describe, expect, it } from "vitest";

process.env.DATABASE_URL ??= "postgresql://postgres:postgres@127.0.0.1:5432/app_db";
const { isComparisonQuery, detectMentionedCampus, detectMentionedCampuses } = await import("@/lib/services/chat");
const { inferCampus } = await import("@/lib/crawler/parser");

describe("comparison query detection", () => {
  it("recognises explicit comparison language", () => {
    expect(isComparisonQuery("Compare BS AI fees across all campuses")).toBe(true);
    expect(isComparisonQuery("Which campus is cheapest for BBA?")).toBe(true);
    expect(isComparisonQuery("Karachi vs Multan fee for computer science")).toBe(true);
    expect(isComparisonQuery("What is the fee for BS AI at Karachi?")).toBe(false);
  });

  it("detects every campus explicitly named in a query", () => {
    expect(detectMentionedCampuses("Karachi vs Multan fee for BS AI")).toEqual(["karachi", "multan"]);
    expect(detectMentionedCampuses("What about Kamra and Bahu campus?")).toEqual(["kamra", "bahu"]);
    expect(detectMentionedCampuses("Tell me about Islamabad main campus")).toEqual(["islamabad-main"]);
    expect(detectMentionedCampuses("Generic question with no campus")).toEqual([]);
  });

  it("single-campus helper still returns the first match", () => {
    expect(detectMentionedCampus("Karachi vs Multan")).toBe("karachi");
  });
});

describe("real-world campus host mapping", () => {
  it("maps each official campus domain to the correct campus code", () => {
    expect(inferCampus("https://khi.au.edu.pk/Pages/Admission/fees_financial.aspx")).toBe("karachi");
    expect(inferCampus("https://kc.au.edu.pk/Pages/Admission/fees_financial.aspx")).toBe("kharian");
    expect(inferCampus("https://aumc.edu.pk/fee")).toBe("multan");
    expect(inferCampus("https://aack.au.edu.pk/Pages/Admission/doc/Fee.pdf")).toBe("kamra");
    expect(inferCampus("https://sk.au.edu.pk/Pages/Admission/FAQS.aspx")).toBe("bahu");
    expect(inferCampus("https://webdata.au.edu.pk/Pages/Admission/fees_financial.aspx")).toBe("islamabad-main");
    expect(inferCampus("https://www.au.edu.pk/pages/Campus/AU_South_Campus_Isb/Intro.aspx")).toBe("islamabad-main");
    expect(inferCampus("https://www.au.edu.pk/pages/admission/Scholarship.aspx")).toBe("university-wide");
  });
});

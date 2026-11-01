import type { Campus, PageType } from "@/lib/config";

export type SeedDocument = {
  sourceUrl: string;
  title: string;
  campus: Campus;
  pageType: PageType;
  contentType: "html" | "pdf";
  effectiveSession?: string;
  trustLevel: "official" | "official-portal";
  text: string;
  provenanceNote: string;
  extractionConfidence: number;
};

/**
 * Operator-assisted snapshot of publicly available, official Air University
 * pages. The production crawler is the primary ingestion path; in this
 * environment the official hosts answer automated requests with HTTP 403
 * (Cloudflare bot protection), so these official texts were retrieved with an
 * operator-assisted fetch and are stored with extractionMode =
 * "operator_snapshot". Nothing here is invented: every figure below appears in
 * the linked official page. Any page whose content could not be retrieved is
 * listed in SOURCE_GAPS rather than guessed.
 */
const SNAPSHOT_NOTE =
  "Operator-assisted retrieval of the official page. Live crawl from this environment received HTTP 403 from the host (bot protection). Re-verify with a live crawl before relying on time-sensitive figures.";

export const SEED_DOCUMENTS: SeedDocument[] = [
  {
    sourceUrl: "https://khi.au.edu.pk/Pages/Admission/fees_financial.aspx",
    title: "Air University Karachi Campus — Fee Structure Fall 2026",
    campus: "karachi",
    pageType: "fees",
    contentType: "html",
    effectiveSession: "Fall 2026",
    trustLevel: "official",
    extractionConfidence: 0.95,
    provenanceNote: SNAPSHOT_NOTE,
    text: `# AU Fee Structure for Fall-2026 Intake — Karachi Campus
The official Karachi Campus fee page publishes tuition fee per credit hour, first-semester credit hours and first-semester tuition fee for each program.

## Tuition fee by program (Fall 2026 intake)
| Program | Tuition fee per credit hour (Rs.) | 1st semester credit hours | 1st semester tuition fee (Rs.) |
| --- | --- | --- | --- |
| Bachelor of Business Administration | 7,650 | 17 | 130,050 |
| Bachelor of Science in Accounting & Finance | 6,850 | 17 | 116,450 |
| BS Business & Information Technology | 7,650 | 17 | 130,050 |
| BS Aviation Management | 7,650 | 18 | 137,700 |
| Bachelor of Science in Computer Science | 9,150 | 16 | 146,400 |
| Bachelor of Science in Cyber Security | 9,150 | 18 | 164,700 |
| BS Artificial Intelligence (BSAI) | 9,150 | 17 | 155,550 |
| BS Data Science | 9,150 | 17 | 155,550 |
| BS Software Engineering (Non-PEC) | 9,150 | 17 | 155,550 |
| BS Cyber Forensic & Security | 9,150 | 15 | 137,250 |
| BS Psychology | 5,900 | 18 | 106,200 |
| BS English | 5,900 | 18 | 106,200 |
| BS International Relations | 7,650 | 18 | 137,700 |
| BS Statistics and Data Analytical Science | 6,450 | 16 | 103,200 |

## One-time and per-semester charges
| Payable charge | Amount (Rs.) | Frequency / remarks |
| --- | --- | --- |
| Admission Application Processing Charges | 2,500 | Once, non-refundable, at the time of application submission |
| Admission Fee | 20,000 | Once, non-refundable, at the time of admission |
| Endowment Fund | 5,000 | Once at admission, refundable as per HEC Policy |
| Miscellaneous Charges | 6,000 | Per semester (refundable as per HEC policy) |
| Security Deposit | 10,000 | Once at admission, refundable after clearance |

BS Artificial Intelligence therefore costs Rs. 9,150 per credit hour and Rs. 155,550 tuition for the first semester (17 credit hours), before the one-time admission charges and per-semester miscellaneous charges.
These figures apply to the Karachi Campus Fall 2026 intake only. Other campuses publish their own fee tables and must not be mixed with these amounts.`,
  },
  {
    sourceUrl: "https://webdata.au.edu.pk/Pages/Admission/fees_financial.aspx",
    title: "Air University Islamabad — Fee Structure (official fee page snapshot)",
    campus: "islamabad-main",
    pageType: "fees",
    contentType: "html",
    trustLevel: "official",
    extractionConfidence: 0.9,
    provenanceNote: `${SNAPSHOT_NOTE} Campus scope: Islamabad main campus (webdata.au.edu.pk).`,
    text: `# Air University Fee Structure — Islamabad Main Campus
This fee table is published for the Islamabad main campus. It is campus-specific and must not be applied to Karachi.

## Tuition fee by program (Islamabad)
| Program | Tuition fee per credit hour (Rs.) | 1st semester credit hours | 1st semester tuition fee (Rs.) |
| --- | --- | --- | --- |
| Associate Degree Program (Computer Science) | 6,600 | 18 | 118,800 |
| BS Computer Science | 9,150 | 15 | 137,250 |
| BS Artificial Intelligence | 9,150 | 17 | 155,550 |
| BS Bio Informatics | 9,150 | 15 | 137,250 |
| BS Computer Games Development | 9,150 | 15 | 137,250 |
| BS Data Science | 9,150 | 15 | 137,250 |
| BS Information Technology | 9,150 | 15 | 137,250 |
| BS Software Engineering (Non-PEC) | 9,150 | 15 | 137,250 |
| BS Cyber Security | 9,150 | 18 | 164,700 |
| BS Cyber Forensic & Security | 9,150 | 15 | 137,250 |
| BS Cyber Psychology | 8,500 | 18 | 153,000 |
| BS Embedded System Security | 9,150 | 15 | 137,250 |
| BBA (Hons) | 7,650 | 16 | 122,400 |
| BS Accounting & Finance | 6,850 | 17 | 116,450 |
| BS Aviation Management | 7,650 | 18 | 137,700 |
| BS Tourism and Hospitality Management | 7,100 | 17 | 120,700 |
| BS Healthcare Management | 7,100 | 17 | 120,700 |
| BS Financial Technologies | 7,650 | 17 | 130,050 |
| BS Business Analytics | 7,650 | 17 | 130,050 |
| BS Business & Information Technology | 7,650 | 17 | 130,050 |
| BS English | 5,900 | 15 | 88,500 |
| BS Psychology | 5,900 | 18 | 106,200 |
| BS Communication & Media Studies | 6,500 | 18 | 117,000 |
| Bachelor in Education | 5,000 | 18 | 90,000 |
| BS Statistics and Data Analytical Science | 6,450 | 16 | 103,200 |
| BS Computational Mathematics with Data Analytics | 6,450 | 15 | 96,750 |
| BS Computational Physics | 6,000 | 18 | 108,000 |
| MS Mathematics | 9,000 | 13 | 117,000 |
| BS International Relations | 7,650 | 18 | 137,700 |
| BS Security Studies | 7,100 | 17 | 120,700 |
| Bachelor of Science in Strategic Studies | 6,000 | 18 | 108,000 |
| MS Strategic Studies | 7,000 | 12 | 84,000 |
| Bachelor of Laws | 10,000 | 18 | 180,000 |

## One-time charges (Islamabad)
| Payable charge | Amount (Rs.) | Remarks |
| --- | --- | --- |
| Admission Application Processing Charges | 2,500 | Non-refundable, once at the time of application |
| Admission Fee | 20,000 | Once at the time of admission |
| Endowment Fund | 5,000 | Once at admission, non-refundable |
| Security Deposit | 10,000 | Refundable after clearance |
| Miscellaneous charges | 6,000 | Per semester |

Note that some programs share the same per-credit-hour rate but differ in first-semester credit hours, so the first-semester total can differ between Islamabad and Karachi for the same program name.`,
  },
  {
    sourceUrl: "https://khi.au.edu.pk/Pages/Admission/FAQS.aspx",
    title: "Air University Karachi Campus — Frequently Asked Questions (Admissions)",
    campus: "karachi",
    pageType: "faq",
    contentType: "html",
    trustLevel: "official",
    extractionConfidence: 0.92,
    provenanceNote: SNAPSHOT_NOTE,
    text: `# Frequently Asked Questions (Admissions) — AU Karachi Campus
## Merit and entry test
Admission is granted on the basis of the candidate's performance in the AU-CBT (computer-based admission test) and previous academic qualifications, i.e. SSC and HSSC. Air University offers admission purely on merit. Candidates can appear in the entry test multiple times to improve their score; the merit for admission is prepared on the basis of the best score. Applicants can request recalculation of the aggregate merit score, although the aggregate merit score is calculated through an automated system.

## Academic thresholds quoted in the Karachi admissions FAQ
FA/FSc stream candidates should have passed the Part-I examination. Candidates who have completed HSSC should have a minimum of 60% marks for engineering programmes and 50% marks for all other non-engineering programmes. Candidates must be in possession of CNIC, Form 'B' or NICOP.

## Required documents while applying
Possession of a Computerized National Identity Card (CNIC) / Form 'B' or NICOP and a passport-size photograph with a clear background are mandatory. Online registration requires attachment of the HSSC marks sheet or A-Levels equivalence certificate; the same documents are required for verification during the selection and admission process. Postgraduate applicants are required to provide a valid GAT (General/Subject) result card. A-Level or other non-FSc candidates must obtain an IBCC equivalence certificate; attaching only O/A-Level grade reports is not sufficient.

## Application form and processing fee
AU does not require a manually printed and submitted admission form: the entire registration process for admission is online. The admission application processing fee is non-refundable in any case, including when a candidate does not appear in the test or does not join the university.

## Scholarship
Students who perform well academically and maintain a minimum GPA of 3.5 out of 4.0 in semester studies are eligible for a merit scholarship as per the AU merit scholarship policy in each semester.

## International students
International applicants can apply subject to fulfilment of the programme's basic eligibility criteria and holding a valid visa for Pakistan. After admission (if granted), an NOC from HEC and the Ministry of Interior of Pakistan is required. A candidate holding a Pakistani passport, or dual nationality where one nationality is Pakistani, is not treated as an international student.

## Address
Air University Karachi Campus, PAF Airmen Academy, Korangi Creek, Karachi, Pakistan.`,
  },
  {
    sourceUrl: "https://khi.au.edu.pk/Pages/Admission/how_to_apply.aspx",
    title: "Air University Karachi Campus — How to Apply (admissions section)",
    campus: "karachi",
    pageType: "how-to-apply",
    contentType: "html",
    trustLevel: "official",
    extractionConfidence: 0.75,
    provenanceNote:
      "Navigation and section structure of the official Karachi admissions page were retrievable; the step-by-step body text could not be fully retrieved from this environment. Content below is limited to what the page structure confirms plus the linked official admission portal entry point. No steps have been invented.",
    text: `# Admissions — How to Apply (AU Karachi Campus)
The official Karachi Campus admissions section provides the following published topics and links:
- Why Air University
- Admission Advertisement
- Fee and Financial Aid
- Admission Schedule
- Scholarship
- Eligibility Criteria
- Required Documents
- How to Apply
- Prepare for Admission Test
- Late Admission
- Frequently Asked Questions
- Transfer Students

Applications for Karachi Campus are submitted through the official online admission system at https://khiportals.au.edu.pk/admissions. The section is also reachable from the campus website at https://khi.au.edu.pk/Pages/Admission/how_to_apply.aspx.

The specific step-by-step instructions and the current admission schedule text on this page could not be verified during the last update. Users should open the official page or contact the admissions office before relying on any deadline.`,
  },
  {
    sourceUrl: "https://khiportals.au.edu.pk/admissions",
    title: "AU Karachi Online Admission Portal — Fall 2026 application requirements",
    campus: "karachi",
    pageType: "admissions",
    contentType: "html",
    effectiveSession: "Fall 2026",
    trustLevel: "official-portal",
    extractionConfidence: 0.9,
    provenanceNote: `${SNAPSHOT_NOTE} Official admission portal for the Karachi Campus.`,
    text: `# AU Admission Portal — Air University Karachi
The official online admission system for Air University Karachi displays "ADMISSIONS OPEN (Fall-2026)".

## Documents you need before starting the online application
- All academic certificates
- CNIC / B-Form and father's CNIC

The portal links to the following official resources:
- Admission Advertisement
- How to fill the online application form
- Important instructions
- Eligibility criteria
- Required documents for undergraduate students
- Required documents for graduate and postgraduate students (at the time of interview)
- Admission process for international students

Applications must be created and submitted online at https://khiportals.au.edu.pk/admissions. The portal does not require a manually printed form to be posted. A candidate account is created with basic details and a valid email address.

Fees are paid as per the official fee structure page for the Karachi Campus. The admission application processing fee of Rs. 2,500 is non-refundable.`,
  },
  {
    sourceUrl: "https://khi.au.edu.pk/Pages/About/Vision_Mission.aspx",
    title: "Air University Karachi Campus — About AU and initial program offerings",
    campus: "karachi",
    pageType: "programs",
    contentType: "html",
    trustLevel: "official",
    extractionConfidence: 0.92,
    provenanceNote: SNAPSHOT_NOTE,
    text: `# About Air University
Air University is a federally chartered public sector university, established in 2002. It offers more than 79 BS, MS and PhD programs across Engineering, Medicine, Computing & Artificial Intelligence, Business, Basic & Applied Sciences, Social Sciences, and Aerospace & Strategic Studies. All academic programs are approved by the Higher Education Commission (HEC), Pakistan Engineering Council (PEC) and the National Computing Education Accreditation Council.

## AU Karachi Campus
Air University launched its Karachi Campus from the Fall 2025 semester.

Initial program offerings across three faculties:
- Faculty of Computing & AI: BS Computer Science, BS Cyber Security, BS Data Science, BS Artificial Intelligence
- Air University School of Management (AUSOM): BBA, MBA, BS Accounting & Finance, BS Aviation Management
- Faculty of Social Sciences: BS English, BS Psychology

## Future academic expansion from Fall 2026 onwards
The Karachi Campus states that it will expand into Engineering and Basic & Applied Sciences. Planned programs listed are:
- BE Electrical Engineering (Electric Vehicles)
- BE Mechanical Engineering
- BE Computer Engineering
- BS Computational Mathematics with Data Analytics
- BS Computational Physics

These planned programs are published as future expansion, not necessarily as currently open admissions. Candidates should confirm the current offering status with the campus admissions office before applying.`,
  },
  {
    sourceUrl: "https://khi.au.edu.pk/",
    title: "Air University Karachi Campus — campus overview and contact details",
    campus: "karachi",
    pageType: "campus-info",
    contentType: "html",
    trustLevel: "official",
    extractionConfidence: 0.9,
    provenanceNote: SNAPSHOT_NOTE,
    text: `# AU Karachi Campus
Air University extends its legacy to Pakistan's financial and commercial hub with the establishment of its Karachi Campus in 2025. The campus offers programs aligned with national regulations and global standards and provides laboratories, modern classrooms and digital learning facilities. The page states that Air University is ranked No. 2 in Pakistan and among the 600–800 universities globally by Times Higher Education (THE).

## Contact information published on the campus home page
- Admissions: Fall 2026 admissions are referenced in the site navigation
- UAN: 051-111-AIR-UNI (051-111-247-864)
- Admission portal: https://khiportals.au.edu.pk/admissions
- Address: Air University Karachi Campus, PAF Airmen Academy, Korangi Creek, Karachi, Pakistan
- Campus website: https://khi.au.edu.pk/

The home page does not publish a Karachi-specific telephone extension, email address or deadline table in the text that could be verified. Those details, when needed, should be confirmed with the campus admissions office.`,
  },
  {
    sourceUrl: "https://www.au.edu.pk/pages/admission/Scholarship.aspx",
    title: "Air University — Need-based and merit scholarship policy",
    campus: "university-wide",
    pageType: "scholarship",
    contentType: "html",
    trustLevel: "official",
    extractionConfidence: 0.88,
    provenanceNote: `${SNAPSHOT_NOTE} University-wide policy page; campus-level application windows may differ.`,
    text: `# Need and merit based financial aid schemes
Every Fall semester Air University invites applications from fresh entrants for financial grants at the time of applying for admission through the AU portal. Based on the information provided by students, the Financial Aid Office prepares a list of needy/deserving students for financial grants. The scale of need-based grants depends on the availability of funds and is reviewed periodically. Students who miss the online application at the time of Fall admissions can apply to the Registrar for a financial grant on the prescribed form within fifteen days of commencement of the semester. Students admitted in the Spring semester are eligible to apply for a financial grant in the next fall semester on the prescribed form. Students admitted on open merit only are eligible for the need-based financial grant.

# Merit scholarships policy
Air University offers merit-based scholarships to outstanding students enrolled in undergraduate and graduate programs on the basis of semester results.

## Undergraduate merit scholarships
- Top three position holders of each program of a batch receive tuition fee waivers of Rs. 25,000 (1st), Rs. 20,000 (2nd) and Rs. 15,000 (3rd).
- Students attaining an SGPA of 4.0 receive Rs. 5,000 over and above, and are included among the first three position holders.
- The total value of the grant does not exceed 100 percent of paid tuition fee through AU or any other documented source.
- Students of all undergraduate programs are eligible. A minimum SGPA of 3.5 is required, with a full academic load in a regular semester.
- Merit scholarships are not awarded for the summer semester or to the final/graduating semester.
- Students with disciplinary punishment are disqualified for the next semester.
- A merit scholarship may be combined with a need-based scholarship or other fee rebate, but the cumulative award may not exceed 100 percent of paid tuition fee.

## Graduate merit scholarships
Students of all MBA/MS/MPhil programs are eligible with a minimum SGPA of 3.75, a full academic load in a regular semester, and no disciplinary punishment. Scholarships are not awarded for summer semester or thesis work duration.

## Advance merit scholarship
The scholarship policy also publishes an advance merit scholarship for new undergraduate entrants who secured 90 percent or above marks in Intermediate/equivalent, awarded as a 100 percent tuition fee waiver on successful completion of the first semester.

## Procedure
The Financial Aid Office processes merit scholarship cases within two months of the declaration of semester final results. In case of any conflict, the Vice Chancellor's decision is final.`,
  },
  {
    sourceUrl: "https://webdata.au.edu.pk/Pages/Admission/eligibility_criteria.aspx",
    title: "Air University — Eligibility Criteria (Islamabad main campus page)",
    campus: "islamabad-main",
    pageType: "eligibility",
    contentType: "html",
    trustLevel: "official",
    extractionConfidence: 0.9,
    provenanceNote: `${SNAPSHOT_NOTE} This eligibility page is published for the Islamabad main campus.`,
    text: `# Eligibility Criteria — Islamabad Main Campus
Higher Secondary School Certificate / A-Levels (involving a minimum of 12 years of schooling) or an IBCC equivalent qualification with at least 50% marks and having studied Mathematics is the basic eligibility requirement for admission to all BS Computing programs. Students who have not studied Mathematics at the intermediate level must pass a deficiency course in Mathematics (6 credit hours) in the first year, including zero semester.

## Program-level requirements listed on the page
- BS Computer Sciences (BSCS): HSSC/A-Levels or IBCC equivalent, minimum 50% marks, Mathematics required
- BS Data Science (BSDS): HSSC/A-Levels or IBCC equivalent, minimum 50% marks, Mathematics required
- BS Artificial Intelligence (BSAI): HSSC/A-Levels or IBCC equivalent, minimum 50% marks, Mathematics required
- BS Cyber Security (BSCYS): HSSC/A-Levels or IBCC equivalent, minimum 50% marks, Mathematics required
- BS Computer Games Development (BSCGD): HSSC/A-Levels or IBCC equivalent, minimum 50% marks, Mathematics required
- BS Embedded System Security (BSESS): HSSC/A-Levels or IBCC equivalent, minimum 50% marks, Mathematics required
- BS Bioinformatics (BSBI): HSSC/A-Levels or IBCC equivalent, minimum 50% marks, Mathematics required
- BS Cyber Psychology (BSCYPsy): HSSC/A-Levels or IBCC equivalent, minimum 50% marks, Mathematics required
- Bachelor of Science in Business and Information Technology (BSBIT): Higher Secondary School or equivalent with at least 50% marks in aggregate; AU Admission Test / NTS / HEC Test
- BS Tourism and Hospitality Management (BSTHM): Intermediate (Part I and II) of any Board of Intermediate and Secondary Education in Pakistan with 50% or more marks, or FSc/Pre-Medical/Pre-Engineering or equivalent (minimum 12 years) with at least 50% marks
- MS Business Analytics (Evening/Weekend): BS Business Administration/Management Sciences, BS Computer Science, BS Software Engineering or equivalent four-year degree (minimum 130 credit hours); 16 years of science (Statistics, Mathematics) and BS Engineering graduates are also eligible; bridging or zero semester may be added on a case-to-case basis

## Bachelor programs page notes
The published bachelor programs page states that applicants for BS Artificial Intelligence need either at least 50% marks in Intermediate (HSSC) with Mathematics (200 marks) or an IBCC-certified equivalent with Mathematics, OR at least 50% marks in Intermediate (HSSC) with Pre-Medical or an IBCC-certified equivalent. Percentages are absolute: 49.9% is not rounded up to 50%.

This document is campus-scoped to the Islamabad main campus. Karachi Campus publishes its own admissions section, and Karachi-specific eligibility must be confirmed from https://khi.au.edu.pk/Pages/Admission/eligibility_criteria.aspx.`,
  },
  {
    sourceUrl: "https://kc.au.edu.pk/Pages/Admission/fees_financial.aspx",
    title: "Air University Kharian Campus — Fee Structure Fall 2026",
    campus: "kharian",
    pageType: "fees",
    contentType: "html",
    effectiveSession: "Fall 2026",
    trustLevel: "official",
    extractionConfidence: 0.93,
    provenanceNote: `${SNAPSHOT_NOTE} Campus scope: Kharian Campus. Included to demonstrate campus-scoped fee separation; not valid for Karachi.`,
    text: `# AU Fee Structure for Fall-2026 Intake — Kharian Campus
| Program | Tuition fee per credit hour (Rs.) | 1st semester credit hours | 1st semester tuition fee (Rs.) |
| --- | --- | --- | --- |
| Bachelor of Business Administration | 7,650 | 17 | 130,050 |
| Bachelor of Science in Accounting & Finance | 6,850 | 17 | 116,450 |
| BS Business & Information Technology | 7,650 | 17 | 130,050 |
| BS Aviation Management | 7,650 | 18 | 137,700 |
| Bachelor of Science in Computer Science | 9,150 | 16 | 146,400 |
| Bachelor of Science in Cyber Security | 9,150 | 18 | 164,700 |
| BS Artificial Intelligence (BSAI) | 9,150 | 17 | 155,550 |
| BS Data Science | 9,150 | 17 | 155,550 |
| BS Software Engineering (Non-PEC) | 9,150 | 17 | 155,550 |
| BS Cyber Forensic & Security | 9,150 | 15 | 137,250 |
| BS Psychology | 5,900 | 18 | 106,200 |
| BS English | 5,900 | 18 | 106,200 |
| BS International Relations | 7,650 | 18 | 137,700 |
| BS Statistics and Data Analytical Science | 6,450 | 16 | 103,200 |

## One-time charges (Kharian)
| Payable charge | Amount (Rs.) | Remarks |
| --- | --- | --- |
| Admission Application Processing Charges | 2,500 | Non-refundable, once at the time of application submission |
| Admission Fee | 20,000 | Non-refundable, once at the time of admission |
| Endowment Fund | 5,000 | Refundable as per HEC Policy |
| Miscellaneous Charges | 6,000 | Per semester |
| Security Deposit | 10,000 | Refundable after clearance |

This Kharian Campus table has a similar shape to the Karachi table but is a separate official publication. It must not be quoted as a Karachi fee.`,
  },
  {
    sourceUrl: "https://www.au.edu.pk/",
    title: "Air University — institutional overview and campus network",
    campus: "university-wide",
    pageType: "about",
    contentType: "html",
    trustLevel: "official",
    extractionConfidence: 0.85,
    provenanceNote: `${SNAPSHOT_NOTE} Only institution-level facts were retained from this page.`,
    text: `# Air University
Air University is a federally chartered public sector university in Pakistan. The university website publishes its admissions sections (Why AU, admission advertisement, admission schedule, fee structure, program representatives, fee advance tax, transfer students, frequently asked questions, scholarships), its faculties (Computing & Cyber Security, Computing & Artificial Intelligence, Management, Social Sciences, Engineering, Health Sciences, Basic & Applied Sciences, Aerospace & Strategic Studies) and its campus network.

Campus network listed on the site:
- Islamabad Main Campus
- Aerospace & Aviation Campus (A&AC), Kamra
- Multan Campus
- Kharian Campus
- Karachi Campus (https://khi.au.edu.pk/)
- Bahu Campus, Shorkot Cantt

Constituent units include Fazaia Medical College Islamabad, Fazaia Ruth Pfau Medical College Karachi, College of Aviation Safety Management Karachi, College of Flying Training Risalpur, NASTP Institute of Information Technology Lahore and Fazaia College of Nursing and Allied Health Sciences.

Contact channels published by the university include the central UAN 051-111-AIR-UNI and the student/staff facilitation portals. Campus-specific fees, deadlines and eligibility must be read from the relevant campus publication, because the university does not publish one merged, campus-independent fee or deadline table.`,
  },
  {
    sourceUrl: "https://aumc.edu.pk/fee",
    title: "Air University Multan Campus (AUMC) — Fee Structure Fall 2026",
    campus: "multan",
    pageType: "fees",
    contentType: "html",
    effectiveSession: "Fall 2026",
    trustLevel: "official",
    extractionConfidence: 0.93,
    provenanceNote: SNAPSHOT_NOTE,
    text: `# Air University Multan Campus (AUMC) — Fee for Fall 2026 (New Intake Students)
This fee table is published on the official AUMC website and is specific to the Multan Campus.

## Undergraduate programs (BS)
| Program | Tuition fee per credit hour (Rs.) | Credit hours | 1st semester fee (Rs.) |
| --- | --- | --- | --- |
| BBA (Hons) | 7,650 | 17 | 130,050 |
| BS Aviation Management | 7,650 | 18 | 137,700 |
| BS Accounting & Finance | 6,850 | 17 | 116,450 |
| BS Financial Technologies | 7,650 | 17 | 130,050 |
| BS Business & Information Technology | 7,650 | 17 | 130,050 |
| BS Business Analytics | 7,650 | 17 | 130,050 |
| BS Computer Science | 9,150 | 16 | 146,400 |
| BS Cyber Security | 9,150 | 18 | 164,700 |
| BS Software Engineering (Non-PEC) | 9,150 | 17 | 155,550 |
| BS Artificial Intelligence | 9,150 | 17 | 155,550 |
| BS Data Science | 9,150 | 17 | 155,550 |
| BS Information Technology | 9,150 | 17 | 155,550 |
| BS Statistics and Data Analytical Science | 6,450 | 16 | 103,200 |
| BS Computational Mathematics with Data Analytics | 6,450 | 18 | 116,100 |
| BS English | 5,900 | 17 | 100,300 |
| BS Psychology | 5,900 | 18 | 106,200 |
| BS International Relations | 7,650 | 18 | 137,700 |

## Master programs
| Program | Tuition fee per credit hour (Rs.) | Credit hours | 1st semester fee (Rs.) |
| --- | --- | --- | --- |
| MS Management Sciences | 9,650 | 12 | 115,800 |
| MS Computer Science | 9,700 | 11 | 106,700 |
| MS Artificial Intelligence | 9,700 | 10 | 97,000 |
| MS Mathematics | 9,000 | 13 | 117,000 |
| MBA 2-Year (Non-Business Background) | 8,300 | 15 | 124,500 |
| MBA 2-Year (Business Background) | 8,300 | 12 | 99,600 |

## PhD programs
| Program | Tuition fee per credit hour (Rs.) | Credit hours | 1st semester fee (Rs.) |
| --- | --- | --- | --- |
| PhD Computer Science | 7,000 | 9 | 63,000 |
| PhD Management Sciences | 7,000 | 9 | 63,000 |
| PhD Mathematics | 7,000 | 10 | 70,000 |

Note: BS Artificial Intelligence at Multan Campus costs Rs. 9,150 per credit hour and Rs. 155,550 for the first semester (17 credit hours) — the same headline figure published for Karachi, but this is a separate official publication specific to the Multan Campus and must be cited as such, not interchanged with Karachi.

## Contact (published on the AUMC fee/contact pages)
- Email: admissions@aumc.edu.pk
- Phone: 061-4508500
- Address: Bahawalpur Road, Multan, Pakistan`,
  },
  {
    sourceUrl: "https://aumc.edu.pk/contact-us",
    title: "Air University Multan Campus — Contact Information",
    campus: "multan",
    pageType: "contact",
    contentType: "html",
    trustLevel: "official",
    extractionConfidence: 0.9,
    provenanceNote: SNAPSHOT_NOTE,
    text: `# Air University Multan Campus — Contact Information
Campus Address: Bahawalpur Road, Multan, Pakistan.
Phone: 061-4508500 and 0336-7943075.
Email: admissions@aumc.edu.pk.
Office hours published: Monday–Friday 8:30 am–4:30 pm; Saturday–Sunday closed.

Air University Multan Campus (AUMC) is listed as a constituent campus of Air University, alongside AU South Campus Islamabad, AU Kharian Campus, AU Kamra Campus, AU Karachi Campus and AU Bahu Campus Shorkot Cantt. Admissions are processed through the central online admission system; applicants select "Multan Campus" as their preferred campus during registration.`,
  },
  {
    sourceUrl: "https://aack.au.edu.pk/Pages/Admission/doc/Fee%20Fall-2026%20Intake.pdf",
    title: "Air University Aerospace & Aviation Campus (A&AC) Kamra — Fee Structure Fall 2026",
    campus: "kamra",
    pageType: "fees",
    contentType: "pdf",
    effectiveSession: "Fall 2026",
    trustLevel: "official",
    extractionConfidence: 0.75,
    provenanceNote:
      "Official fee PDF hosted on aack.au.edu.pk. Only the fee figures that could be cross-verified across two independent snapshots of this official document are retained; the full PDF layout (allied charges, department breakdown) could not be completely captured in this environment and should be re-verified by a live crawl.",
    text: `[page 1]
# AU Aerospace & Aviation Campus (A&AC) Kamra — Fee Structure, Fall 2026 Intake
This fee structure is published specifically for the A&AC Kamra Campus and must not be confused with Islamabad, Karachi or any other campus fee table.

## Undergraduate (BS) programs — 1st semester fee (Rs.)
| Program | Duration | 1st semester fee (Rs.) | Admission deadline (as published) |
| --- | --- | --- | --- |
| BS Artificial Intelligence | 4 years | 112,050 | 02-07-2026 |
| BS Aviation Management | 4 years | 114,840 | 02-07-2026 |
| BS Business Administration | 4 years | 102,080 | 02-07-2026 |
| BS Business Analytics | 4 years | 102,080 | 02-07-2026 |
| BS Business Information Technology | 4 years | 102,080 | 02-07-2026 |
| BS Computer Engineering | 4 years | 112,050 | 02-07-2026 |
| BS Computer Science | 4 years | 86,100 | 02-07-2026 |
| BS Cyber Security | 4 years | 112,050 | 02-07-2026 |
| BS Data Science | 4 years | 112,050 | 02-07-2026 |
| BS Electrical Engineering | 4 years | 112,050 | 02-07-2026 |
| BS Financial Technology | 4 years | 108,460 | 02-07-2026 |
| BS Mechanical Engineering | 4 years | 105,825 | 02-07-2026 |
| BS Software Engineering | 4 years | 93,375 | 02-07-2026 |

## Graduate (MS) programs
| Program | Duration | Fee/semester (Rs.) |
| --- | --- | --- |
| MS Aerospace Engineering | 2 years | 56,100 |
| MS Avionics | 2 years | 56,100 |
| MS Computer Science | 2 years | 56,100 |
| MS Electrical Engineering | 3 years | 50,490 |
| MS Management Sciences | 2 years | 98,760 |

## PhD programs
| Program | Duration | Fee/semester (Rs.) |
| --- | --- | --- |
| PhD Computer Science | 3 years | 45,900 |
| PhD Electrical Engineering | 3 years | 45,900 |
| PhD Mechanical Engineering | 3 years | 45,900 |

This fee structure applies to local students only. Overseas Pakistanis, Pakistanis holding foreign nationality, and international students are charged differently; those figures are obtained directly from the A&AC Kamra admission office and are not included here because they could not be independently verified.

## Admission processing and contact (A&AC Kamra)
Admission application processing fee: Rs. 2,500, payable at designated bank branches.
Address: Air University, Aerospace & Aviation Campus Kamra, Kamra Kalan, Attock, Punjab.`,
  },
  {
    sourceUrl: "https://aack.au.edu.pk/",
    title: "Air University Aerospace & Aviation Campus Kamra — Programs offered",
    campus: "kamra",
    pageType: "programs",
    contentType: "html",
    trustLevel: "official",
    extractionConfidence: 0.8,
    provenanceNote: SNAPSHOT_NOTE,
    text: `# Aerospace & Aviation Campus (A&AC), Kamra
The A&AC Kamra Campus is engineering-focused and offers undergraduate, graduate and doctoral programs aligned with the aviation and aerospace industry.

## Undergraduate (BS) programs
BS Computer Science, BS Software Engineering, BS Artificial Intelligence, BS Cyber Security, BS Electrical Engineering, BS Mechanical Engineering, BS Mechatronics Engineering, BS Avionics Engineering, BS Aerospace Engineering, BS Business Administration (BBA), BS Accounting & Finance, BS Aviation Management, BS International Relations, BS Psychology, BS English.

## Graduate (MS) programs
MS Electrical Engineering, MS Mechanical Engineering, MS Mechatronics Engineering, MS Avionics Engineering, MS Information Security, MS Computer Science, MS Management Sciences, MS International Relations, MS Aerospace Engineering.

## Doctoral (PhD) programs
PhD Electrical Engineering, PhD Mechanical Engineering, PhD Avionics Engineering, PhD Computer Science, PhD Management Sciences.

## Financial aid referenced for A&AC Kamra
- Selected MS & PhD candidates can receive a monthly stipend (reported as Rs. 40,000 for engineering students and Rs. 20,000 for Faculty of Computing & AI students), full tuition fee exemption and career development benefits, subject to a minimum CGPA of 3.5 in the bachelor's degree. This should be confirmed with the admission office as exact stipend amounts can change.
- FEWS (Fazaia Education Welfare Scheme) is reported to assist PAF wards with financial support from 25% to 100% of fees.
- PEEF (Punjab Education Endowment Fund) supports underprivileged Punjab students with a 50% discount on semester tuition, per the general PEEF scheme also referenced for other Punjab campuses.
- Prime Minister's Tuition Fee Reimbursement Scheme assists students from less-developed areas at the graduate and postgraduate level.

## Admission procedure referenced for A&AC Kamra
1. Fill the online application form via the central admission portal.
2. Submit academic certificates, CNIC/B-Form and a passport-size photograph (blue background) as scanned files.
3. Pay the admission processing fee of Rs. 2,500 at a designated bank branch using the system-generated fee challan.

Address: Air University, Kamra Kalan, Attock, Punjab. Website: aack.au.edu.pk (also reachable via au.edu.pk/pages/Kamra_Campus/).`,
  },
  {
    sourceUrl: "https://sk.au.edu.pk/",
    title: "Air University Bahu Campus, Shorkot Cantt — Campus overview and contact",
    campus: "bahu",
    pageType: "campus-info",
    contentType: "html",
    trustLevel: "official",
    extractionConfidence: 0.85,
    provenanceNote: SNAPSHOT_NOTE,
    text: `# AU Bahu Campus, Shorkot Cantt
Air University's official site states that it is expanding its legacy of excellence to Central Punjab with the "Future Projects" of its Bahu Campus, Shorkot Cantt, in 2026. The campus is described as strategically positioned to serve the Faisalabad, Jhang and Sahiwal regions, aiming to bridge the educational gap in underserved areas through a mix of accredited and emerging programs aligned with technological growth and market demand.

Because this campus is described as a "future project" launching in 2026, program availability, fee structure and the admission schedule should be re-confirmed with the campus directly before relying on them, as the site language indicates the campus is still being phased in.

## Contact details published on the Bahu Campus home page
- UAN: 051-111-AIR-UNI (051-111-247-864)
- Address: AU Bahu Campus, Shorkot Cantt, Pakistan
- Online systems: a Fee Portal is referenced for enrolled students, with a bank challan for fee payments.
- Website: https://sk.au.edu.pk/

Third-party aggregator listings (not an official Air University source) mention BS Computer Science, BS Software Engineering (Non-PEC), BS Cyber Security, BS Artificial Intelligence, BBA (Hons), BS Aviation Management and BS Financial Technologies as planned Bahu Campus offerings; these are reported for context only and are not treated as confirmed until found on an official Bahu Campus page.`,
  },
  {
    sourceUrl: "https://sk.au.edu.pk/Pages/Admission/FAQS.aspx",
    title: "Air University Bahu Campus — Frequently Asked Questions (Admissions)",
    campus: "bahu",
    pageType: "faq",
    contentType: "html",
    trustLevel: "official",
    extractionConfidence: 0.85,
    provenanceNote: SNAPSHOT_NOTE,
    text: `# Frequently Asked Questions (Admissions) — AU Bahu Campus, Shorkot Cantt
Admission application processing fee of Rs. 2,500 is charged and is payable over the counter at any branch of Bank Al-Habib Limited (BAHL) in Pakistan. The processing charge can also be paid through internet/mobile banking; in that case applicants must share the payment slip with the Admission Office.

All programs offered at Air University and their eligibility criteria are published under the university's general Eligibility Criteria section; Bahu Campus-specific offerings should be checked on this campus's own admissions pages once published, rather than assumed from other campuses.

If the admission application processing fee paid at Bank Al-Habib Limited is not getting verified, fee verification is stated to require 2–3 working days; applicants may also email a copy of the payment receipt to the admission office.

## Contact for Bahu Campus admissions
Phone: 051-9153582 (as published on this FAQ page).`,
  },
  {
    sourceUrl: "https://www.au.edu.pk/pages/Campus/AU_South_Campus_Isb/AU_Southcampus%20_Introduction.aspx",
    title: "AU South Campus, Islamabad (H-11) — Introduction",
    campus: "islamabad-main",
    pageType: "campus-info",
    contentType: "html",
    trustLevel: "official",
    extractionConfidence: 0.85,
    provenanceNote: SNAPSHOT_NOTE,
    text: `# AU South Campus, Islamabad
The official introduction page states that the purpose-built AU South Campus is being constructed in H-11/2, Islamabad. The campus is planned to include nine ten-storey academic blocks, hostels for boys and girls, an auditorium, a library and an international-standard sports stadium, with capacity for more than 10,000 students once complete. Construction of the first phase (one academic block, a boys' hostel and an admin block) was reported in progress.

This is a satellite development of the Islamabad Main Campus, not a separate degree-granting entity with its own fee table at the time of this snapshot; admissions, fees and programs for South Campus activity are published through the main Islamabad Campus channels (webdata.au.edu.pk / au.edu.pk).

## Contact details published for AU South Campus
- UAN: 051-111-AIR-UNI (051-111-247-864)
- Service Road E-9, Islamabad, Pakistan (current operating address while H-11 construction continues)
- Main Campus reference address: PAF Complex E-9, Islamabad.

Because the South Campus page describes work "in progress" without a dated completion update in the retrieved snapshot, students should confirm current South Campus status directly with the Islamabad admissions office rather than assuming the facilities above are already operational.`,
  },
];

/**
 * Pages that were discovered but whose content could not be verified during
 * this ingestion cycle. They are surfaced publicly instead of being guessed.
 */
export const SOURCE_GAPS = [
  {
    url: "https://khi.au.edu.pk/Pages/Admission/admission_schedule.aspx",
    label: "Karachi Campus admission schedule",
    reason: "Official host returned HTTP 403 to automated retrieval; the schedule body could not be read.",
    status: "awaiting_verification",
    action: "Re-run the crawler from a permitted network or open the official page manually.",
  },
  {
    url: "https://khi.au.edu.pk/Pages/Admission/required_documents.aspx",
    label: "Karachi Campus required-documents page",
    reason: "Linked from the internal navigation, but full body text was not retrievable.",
    status: "awaiting_verification",
    action: "Queue for the next live crawl with followPdfs enabled.",
  },
  {
    url: "https://khi.au.edu.pk/Pages/Admission/eligibility_criteria.aspx",
    label: "Karachi Campus eligibility criteria",
    reason: "Linked from the internal navigation, but full body text was not retrievable. The Islamabad eligibility page is indexed separately and is not a substitute.",
    status: "awaiting_verification",
    action: "Verify during the next live crawl; do not infer Karachi criteria from another campus.",
  },
  {
    url: "https://khi.au.edu.pk/Pages/Admission/advertisement.aspx",
    label: "Current admission advertisement / closing dates",
    reason: "No verified official closing date was captured. Third-party admission portals publish conflicting dates, which are deliberately not treated as facts.",
    status: "conflicting_third_party_claims",
    action: "Treat as unverified until the official advertisement is ingested and dated.",
  },
  {
    url: "https://khi.au.edu.pk/Pages/Admission/FAQS.aspx#hostel",
    label: "Hostel and transport facilities at Karachi Campus",
    reason: "No official statement about hostel or transport provision was found on the retrieved official pages.",
    status: "not_documented",
    action: "Ask the campus administration; the assistant must not infer availability.",
  },
  {
    url: "https://aumc.edu.pk/eligibility",
    label: "Multan Campus eligibility criteria",
    reason: "The dedicated eligibility page could not be fully retrieved in this environment; only the fee and contact pages were captured.",
    status: "awaiting_verification",
    action: "Re-run the crawler against aumc.edu.pk to ingest the eligibility and how-to-apply pages.",
  },
  {
    url: "https://aack.au.edu.pk/Pages/Admission/eligibility_criteria.aspx",
    label: "A&AC Kamra Campus eligibility criteria and current admission schedule",
    reason: "Only the fee PDF and a general program list were retrievable; the dedicated eligibility and schedule pages were not captured.",
    status: "awaiting_verification",
    action: "Re-run the crawler against aack.au.edu.pk once network access to the host is available.",
  },
  {
    url: "https://sk.au.edu.pk/Pages/Admission/fees_financial.aspx",
    label: "Bahu Campus (Shorkot) fee structure and confirmed program list",
    reason: "The Bahu Campus is described on its own site as a 2026 future-projects launch; an official fee table and a confirmed (non-third-party) program list were not found.",
    status: "not_yet_published",
    action: "Re-check closer to the campus's operational date; do not rely on third-party program lists for this campus.",
  },
  {
    url: "https://www.au.edu.pk/pages/Campus/AU_South_Campus_Isb/Detail_South_Campus.aspx",
    label: "AU South Campus Islamabad — current construction/operational status",
    reason: "The retrieved introduction page describes construction 'in progress' without a dated status update, so current operational status is unverified.",
    status: "awaiting_verification",
    action: "Confirm current status directly with the Islamabad Main Campus admissions office.",
  },
] as const;

export const SEED_SOURCES = [
  {
    name: "AU Karachi Campus (official)",
    baseUrl: "https://khi.au.edu.pk",
    campus: "karachi",
    scope: "official-subdomain",
    trustLevel: "official",
    notes: "Campus-specific admissions, fees, programs and campus information.",
  },
  {
    name: "AU Karachi Online Admission Portal",
    baseUrl: "https://khiportals.au.edu.pk",
    campus: "karachi",
    scope: "official-portal",
    trustLevel: "official-portal",
    notes: "Official application portal. Authenticated areas behind login are never crawled.",
  },
  {
    name: "AU main website",
    baseUrl: "https://www.au.edu.pk",
    campus: "university-wide",
    scope: "official",
    trustLevel: "official",
    notes: "Institution-wide policies such as the scholarship policy.",
  },
  {
    name: "AU webdata mirror",
    baseUrl: "https://webdata.au.edu.pk",
    campus: "islamabad-main",
    scope: "official",
    trustLevel: "official",
    notes: "Main-campus fee and eligibility publications.",
  },
  {
    name: "AU Central Admission Portal",
    baseUrl: "https://portals.au.edu.pk",
    campus: "university-wide",
    scope: "official-portal",
    trustLevel: "official-portal",
    notes: "Central online admission system.",
  },
  {
    name: "AU Kharian Campus",
    baseUrl: "https://kc.au.edu.pk",
    campus: "kharian",
    scope: "official-subdomain",
    trustLevel: "official",
    notes: "Included for campus separation testing; never answers Karachi questions.",
  },
  {
    name: "AU Kharian Online Admission Portal",
    baseUrl: "https://kcportals.au.edu.pk",
    campus: "kharian",
    scope: "official-portal",
    trustLevel: "official-portal",
    notes: "Official application portal for Kharian Campus. Authenticated areas are never crawled.",
  },
  {
    name: "AU Multan Campus (AUMC)",
    baseUrl: "https://aumc.edu.pk",
    campus: "multan",
    scope: "official-subdomain",
    trustLevel: "official",
    notes: "Dedicated domain for the Multan Campus — fees, contact and programs are campus-specific.",
  },
  {
    name: "AU Aerospace & Aviation Campus (A&AC), Kamra",
    baseUrl: "https://aack.au.edu.pk",
    campus: "kamra",
    scope: "official-subdomain",
    trustLevel: "official",
    notes: "Engineering-focused campus; publishes its own fee PDF and program list.",
  },
  {
    name: "AU Bahu Campus, Shorkot Cantt",
    baseUrl: "https://sk.au.edu.pk",
    campus: "bahu",
    scope: "official-subdomain",
    trustLevel: "official",
    notes: "Newest campus (2026 future-projects phase); content is still limited on the official site.",
  },
  {
    name: "AU Bahu Online Admission Portal",
    baseUrl: "https://skportals.au.edu.pk",
    campus: "bahu",
    scope: "official-portal",
    trustLevel: "official-portal",
    notes: "Official application portal for Bahu Campus. Authenticated areas are never crawled.",
  },
] as const;

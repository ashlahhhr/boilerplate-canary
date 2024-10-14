"use server";

import prisma from "@/lib/prisma";

export async function generatePerfumes(prevState, formData) {
  const gender = formData.get("gender")?.trim();
  const occasion = formData.get("occasion")?.trim();
  const dayTime = formData.get("dayTime")?.trim();
  const season = formData.get("season")?.trim();

  if (!gender || !occasion || !dayTime || !season) {
    return { error: "Please fill in all fields" };
  }

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "nousresearch/hermes-3-llama-3.1-405b:free",
        messages: [
          {
            content: `perfumes recomendation based For a ${gender} person, I suggest a ${occasion} perfume during ${dayTime} on a ${season} day.`,
          },
          {
            content: `the answer must be formated like this, dont add any string/text other than this format.{
"name": "Dolce & Gabbana Light Blue",
"topNotes": ["Sicilian cedar", "apple", "bellflower"],
"middleNote": ["jasmine", "bamboo", "white rose"],
"bottomNote": ["amber", "musks", "cedarwood"],
"description": "Dolce & Gabbana Light Blue is a refreshing and feminine fragrance perfect for summer daytime wear. Its crisp, fruity top notes blend with delicate floral middle notes and warm, woody base notes, creating a versatile scent suitable for the office or casual outings. The airy, aquatic elements evoke the feeling of a sunny Mediterranean getaway."
}`,
          },
        ],
        parameters: {
          max_new_tokens: 800,
          temperature: 0.5,
          top_p: 0.85,
          repetition_penalty: 1.15,
        },
      }),
    });

    if (!res.ok) {
      return { error: `Failed to fetch data: ${res.statusText}` };
    }

    const data = await res.json();
    console.log(data); // Log for debugging

    const messageObject = data?.choices?.[0]?.message;

    if (!messageObject?.content) {
      return { error: "No content in response", rawData: data };
    }

    const result = messageObject.content;
    console.log(result);

    const perfumeRecommendations = parsePerfumeRecommendations(result);
    console.log(perfumeRecommendations);

    return { recommendations: perfumeRecommendations };
    // return { recommendations: result };
  } catch (error) {
    return { error: `An error occurred: ${error.message}` };
  }
}

// function parsePerfumeRecommendations(text) {
//   const perfumes = [];

//   // Split the text into chunks based on numbers (like 1. 2. 3.)
//   const perfumeList = text.split(/\d+\.\s+/).filter((item) => item.trim());

//   // Loop over each entry and structure it
//   perfumeList.forEach((entry) => {
//     // Attempt to find the perfume name (match anything until the first newline or colon)
//     const nameMatch = entry.match(/^\*\*(.*?)\*\*|^(.*?):/);

//     // Try to extract top, middle, and base notes (more flexible regex)
//     const noteMatch = entry.match(
//       /notes of\s([^,]+),\s([^,]+)\sand\s([^.\n]+)/
//     );

//     perfumes.push({
//       name: nameMatch
//         ? nameMatch[1]?.trim() || nameMatch[2]?.trim()
//         : "Unknown",
//       topNote: noteMatch ? noteMatch[1]?.trim() : "Unknown",
//       middleNote: noteMatch ? noteMatch[2]?.trim() : "Unknown",
//       baseNote: noteMatch ? noteMatch[3]?.trim() : "Unknown",
//       smellDescription: noteMatch
//         ? `A blend of ${noteMatch[1]}, ${noteMatch[2]}, and ${noteMatch[3]}`
//         : entry.trim(), // Use full entry as fallback description
//     });
//   });

//   // If no perfumes were found, return a fallback message
//   if (perfumes.length === 0) {
//     return [{ name: "No recommendations found", smellDescription: text }];
//   }

//   return perfumes;
// }
function parsePerfumeRecommendations(text) {
  const perfumes = [];

  // Ekstrak bagian yang ada di dalam kurung kurawal {}
  const perfumeEntries = text.match(/{[^}]*}/g);

  // Jika tidak ada entri yang ditemukan, kembalikan pesan fallback
  if (!perfumeEntries) {
    return [{ name: "No recommendations found", smellDescription: text }];
  }

  // Proses setiap entri parfum
  perfumeEntries.forEach((entry) => {
    // Parse string JSON
    let perfumeData;
    try {
      perfumeData = JSON.parse(entry);
    } catch (e) {
      // Jika JSON parsing gagal, lewati entri ini
      return;
    }

    // Buat objek parfum dengan struktur yang diinginkan
    perfumes.push({
      name: perfumeData.name || "Unknown",
      topNote: perfumeData.topNotes
        ? perfumeData.topNotes.join(", ")
        : "Unknown",
      middleNote: perfumeData.middleNote
        ? perfumeData.middleNote.join(", ")
        : "Unknown",
      baseNote: perfumeData.bottomNote
        ? perfumeData.bottomNote.join(", ")
        : "Unknown",
      smellDescription: perfumeData.description || "No description available",
    });
  });

  // Jika tidak ada parfum yang ditemukan, kembalikan fallback message
  if (perfumes.length === 0) {
    return [{ name: "No recommendations found", smellDescription: text }];
  }

  return perfumes;
}

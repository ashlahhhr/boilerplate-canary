// src/components/PerfumeForm.js
"use client";

import React from "react";
import { useFormStatus } from "react-dom";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { generatePerfumes } from "@/app/action";

const initialState = {
  recommendations: [],
  error: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Generating..." : "Generate Recommendations"}
    </Button>
  );
}

export default function PerfumeForm() {
  const [state, formAction] = useActionState(generatePerfumes, initialState);

  console.log("Current state:", state);
  console.log("Recommendations:", state.recommendations);

  return (
    <div>
      <form action={formAction} className="space-y-4 mb-8">
        <Select name="gender" required>
          <SelectTrigger>
            <SelectValue placeholder="Select gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
          </SelectContent>
        </Select>

        <Select name="occasion" required>
          <SelectTrigger>
            <SelectValue placeholder="Select occasion" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="work">Work</SelectItem>
            <SelectItem value="school">School</SelectItem>
            <SelectItem value="wedding">Wedding event</SelectItem>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="hangout">Hangout</SelectItem>
          </SelectContent>
        </Select>

        <Select name="dayTime" required>
          <SelectTrigger>
            <SelectValue placeholder="Select day time" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daylight">Daylight</SelectItem>
            <SelectItem value="night">Night</SelectItem>
          </SelectContent>
        </Select>

        <Select name="season" required>
          <SelectTrigger>
            <SelectValue placeholder="Select season" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="summer">Summer</SelectItem>
            <SelectItem value="winter">Winter</SelectItem>
            <SelectItem value="autumn">Autumn</SelectItem>
            <SelectItem value="spring">Spring</SelectItem>
          </SelectContent>
        </Select>

        <SubmitButton />
      </form>

      {state.error && <p className="text-red-500 mb-4">{state.error}</p>}

      {/* <section>
        <h1>{state?.name}</h1>
        <div>
          {state?.basenotes.map((basenote) => {
            return <div key={basenote}>{basenote}</div>;
          })}
        </div>
        <div>
          {state?.middleNotes.map((middleNote) => {
            return <div key={middleNote}>{middleNote}</div>;
          })}
        </div>
        <div>
          {state?.topeNotes.map((topNote) => {
            return <div key={topNote}>{topNote}</div>;
          })}
        </div>

      </section> */}

      {state.recommendations && typeof state.recommendations === "string" ? (
        <p>{state.recommendations}</p> // Display raw recommendations if in string format
      ) : state.recommendations && state.recommendations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {state.recommendations.map((perfume, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{perfume.name || "Unnamed Perfume"}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  <p>
                    <strong>Top Note:</strong> {perfume.topNote || "N/A"}
                  </p>
                  <p>
                    <strong>Middle Note:</strong> {perfume.middleNote || "N/A"}
                  </p>
                  <p>
                    <strong>Base Note:</strong> {perfume.baseNote || "N/A"}
                  </p>
                  <p>
                    <strong>Description:</strong>{" "}
                    {perfume.smellDescription || "No description available"}
                  </p>
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p>No recommendations available. Please try again.</p>
      )}
    </div>
  );
}

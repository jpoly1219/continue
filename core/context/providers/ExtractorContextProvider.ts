// import { extractContext } from "@jpoly1219/context-extractor";
import { extractContext } from "/home/jacob/projects/context-extractor/dist/src/main";

import { Language } from "@jpoly1219/context-extractor/dist/src/types.js";

import { BaseContextProvider } from "../index.js";

import type {
  ContextItem,
  ContextProviderDescription,
  ContextProviderExtras,
  LoadSubmenuItemsArgs,
} from "../../";

// interface ContextExtractorResult {
//   holeTypes: string[];
//   relevantTypes: string[];
//   relevantHeaders: string[];
// }

// interface ContextExtractor {
//   extractContext(
//     code: string,
//     language: string,
//   ): Promise<ContextExtractorResult>;
// }

export class ExtractorContextProvider extends BaseContextProvider {
  constructor(options: { [key: string]: any }) {
    super(options);
  }

  static description: ContextProviderDescription = {
    title: "extractor",
    displayTitle: "Extracted Context",
    description: "Provides context extracted from code using language server",
    type: "normal",
  };

  get description(): ContextProviderDescription {
    return {
      title: "Context Extractor",
      displayTitle: "Extracted Context",
      description: "Provides context extracted from code using language server",
      type: "normal",
    };
  }

  async getContextItems(
    query: string,
    extras: ContextProviderExtras,
  ): Promise<ContextItem[]> {
    console.log("RUNNING");
    console.log(`query: ${query}`);
    console.log(
      `extras: ${(extras.config, extras.embeddingsProvider, extras.fetch, extras.fullInput, extras.ide, extras.llm, extras.reranker, extras.selectedCode)}`,
    );
    try {
      const ctx = await extractContext(
        Language.TypeScript,
        "/home/jacob/projects/context-extractor/targets/booking/sketch.ts",
        "/home/jacob/projects/context-extractor/targets/booking/",
      );

      const obj = ctx
        ? {
            ...ctx,
            relevantTypes: Object.fromEntries(ctx!.relevantTypes),
            relevantHeaders: Object.fromEntries(ctx!.relevantHeaders),
          }
        : {};
      return [
        {
          name: "Test Type 1",
          description: "A dummy type for testing",
          content: "interface TestType { id: number; name: string; }",
        },
        {
          name: "Test Type 2",
          description: "Another dummy type for testing",
          content: "type Status = 'active' | 'inactive' | 'pending';",
        },
        {
          name: "Test Header",
          description: "A dummy header for testing",
          content: "import { useState, useEffect } from 'react';",
        },
        {
          name: "CTX",
          description: "Extracted context.",
          content: `${JSON.stringify(obj, null, 2)}`,
        },
      ];
    } catch (err) {
      console.log("ERROR");
      console.log(err);
      return [];
    }
  }

  async loadSubmenuItems(_args: LoadSubmenuItemsArgs) {
    return [];
  }
}

export default ExtractorContextProvider;

"use server";

import { BarChartComponent } from "@/components/BarChart";
import { openai } from "@ai-sdk/openai";
import { generateId } from "ai";
import { createAI, getMutableAIState, streamUI } from "ai/rsc";
import { ReactNode } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { z } from "zod";

export interface ServerMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ClientMessage {
  id: string;
  role: "user" | "assistant";
  display: ReactNode;
}

export async function continueConversation(
  input: string
): Promise<ClientMessage> {
  const history = getMutableAIState();

  const result = await streamUI({
    model: openai("gpt-4-turbo"),
    messages: [...history.get(), { role: "user", content: input }],
    text: ({ content, done }) => {
      if (done) {
        history.done((messages: ServerMessage[]) => [
          ...messages,
          { role: "assistant", content },
        ]);
      }
      return <div>{content}</div>;
    },
    tools: {
      plotBarChart: {
        description: "Plot the following data as a bar chart",
        parameters: z.object({
          chartConfig: z
            .any()
            .describe(
              "An object containing the configuration for the chart, including labels and colors for each data category. For example, { desktop: { label: 'Desktop', color: '#2563eb' }, mobile: { label: 'Mobile', color: '#60a5fa' } }"
            ),
          chartData: z
            .any()
            .describe(
              "An array of objects representing the data to be plotted on the chart. Each object contains values for different categories. For example, [{ month: 'January', desktop: 186, mobile: 80 }, { month: 'February', desktop: 305, mobile: 200 }]"
            ),
          cardTitle: z
            .string()
            .describe(
              "A string representing the title of the card component. For example, 'Monthly Sales Data'"
            ),
          cardDescription: z
            .string()
            .describe(
              "A string representing the description text of the card component. For example, 'This chart shows the sales data for the first half of the year.'"
            ),
          xAxisLabel: z
            .string()
            .describe(
              "A string representing the label for the x-axis. For example, 'month'"
            ),
          indicator: z
            .enum(["line", "dashed", "dot"])
            .describe(
              "A string representing the type of indicator used in the tooltip content. For example, 'line', 'dashed', or 'dot'"
            ),
          barData: z
            .array(
              z.object({
                dataKey: z
                  .string()
                  .describe(
                    "A string representing the key in the data objects used for the bar data. For example, 'desktop' or 'mobile'"
                  ),
                fill: z
                  .string()
                  .describe(
                    "A string representing the color used to fill the bars representing the data. For example, '#2563eb' for desktop data"
                  ),
              })
            )
            .describe(
              "An array of objects specifying the data keys and fill colors for the bars in the chart. For example, [{ dataKey: 'desktop', fill: '#2563eb' }, { dataKey: 'mobile', fill: '#60a5fa' }]"
            ),
          cardFooter: z
            .string()
            .describe(
              "A string representing the text for the first part of the card footer. For example, 'Total Sales: 1200'"
            ),
          cardFooter2: z
            .string()
            .describe(
              "A string representing the text for the second part of the card footer. For example, 'Updated: July 2024'"
            ),
        }),
        generate: async ({
          chartConfig,
          chartData,
          cardTitle,
          cardDescription,
          xAxisLabel,
          indicator,
          barData,
          cardFooter,
          cardFooter2,
        }) => {
          history.done((messages: ServerMessage[]) => [
            ...messages,
            {
              role: "assistant",
              content: `Plotting Bar chart for ${cardTitle}`,
            },
          ]);
          return (
            <div className="w-[500px]">
              <BarChartComponent
                chartConfig={chartConfig}
                chartData={chartData}
                cardTitle={cardTitle}
                cardDescription={cardDescription}
                xAxisLabel={xAxisLabel}
                indicator={indicator}
                barData={barData}
                cardFooter={cardFooter}
                cardFooter2={cardFooter2}
              />
            </div>
          );
        },
      },
    },
  });

  return {
    id: generateId(),
    role: "assistant",
    display: result.value,
  };
}

export const AI = createAI<ServerMessage[], ClientMessage[]>({
  actions: {
    continueConversation,
  },
  initialAIState: [],
  initialUIState: [],
});

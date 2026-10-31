import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { checkCsrfOrigin } from "@/lib/csrf";
import { InfographicSchema, type InfographicElement } from "@/types/infographic";
import {
  createElement,
  deleteElement,
  duplicateElement,
  exportDocument,
  inspectDocument,
  modifyStyles,
  moveElement,
  updateElement,
} from "@/lib/ai/document-tools";

export const maxDuration = 30;

const OperationSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("inspect") }),
  z.object({ type: z.literal("export") }),
  z.object({ type: z.literal("create"), element: z.record(z.string(), z.unknown()) }),
  z.object({ type: z.literal("update"), id: z.string(), patch: z.record(z.string(), z.unknown()) }),
  z.object({ type: z.literal("delete"), id: z.string() }),
  z.object({ type: z.literal("move"), id: z.string(), x: z.number(), y: z.number() }),
  z.object({ type: z.literal("duplicate"), id: z.string() }),
  z.object({ type: z.literal("styles"), id: z.string(), styles: z.record(z.string(), z.unknown()) }),
]);

const RequestSchema = z.object({
  document: InfographicSchema,
  operation: OperationSchema,
});

export async function POST(req: Request) {
  const csrf = checkCsrfOrigin(req);
  if (!csrf.valid) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Invalid request", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { document, operation } = parsed.data;

  try {
    switch (operation.type) {
      case "inspect":
        return Response.json({ document, inspection: inspectDocument(document) });
      case "export":
        return Response.json({ document, exported: exportDocument(document) });
      case "create": {
        const element = operation.element as unknown as InfographicElement;
        if (!element?.id || !element?.type) {
          return Response.json({ error: "Element id and type are required" }, { status: 400 });
        }
        return Response.json({ document: createElement(document, element) });
      }
      case "update":
        return Response.json({
          document: updateElement(
            document,
            operation.id,
            operation.patch as Partial<InfographicElement>,
          ),
        });
      case "delete":
        return Response.json({ document: deleteElement(document, operation.id) });
      case "move":
        return Response.json({
          document: moveElement(document, operation.id, operation.x, operation.y),
        });
      case "duplicate":
        return Response.json({ document: duplicateElement(document, operation.id) });
      case "styles":
        return Response.json({
          document: modifyStyles(document, operation.id, operation.styles),
        });
      default:
        return Response.json({ error: "Unsupported operation" }, { status: 400 });
    }
  } catch (error) {
    return Response.json(
      {
        error: "Document operation failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 400 },
    );
  }
}

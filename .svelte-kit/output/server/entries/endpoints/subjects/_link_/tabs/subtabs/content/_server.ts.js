import { e as error, j as json } from "../../../../../../../chunks/index.js";
import { s as supabase } from "../../../../../../../chunks/supabaseClient.js";
const POST = async ({ request, locals }) => {
  if (!locals.isAdmin) {
    throw error(401, "Unauthorized");
  }
  try {
    const { content, selectedContent, subtabId, contentType } = await request.json();
    if (!content || !selectedContent || !subtabId || !contentType) {
      throw new Error("Chýbajú povinné parametre");
    }
    const contentData = {
      subtab_id: subtabId,
      content_type: contentType,
      content,
      index: 1,
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    let tableName = "";
    if (selectedContent === 1) {
      tableName = "official_content";
    }
    if (selectedContent === 3) {
      tableName = "private_content";
    }
    const { data, error: insertError } = await supabase.from(tableName).insert([contentData]);
    if (insertError) {
      throw new Error(insertError.message);
    }
    return json({ message: "Obsah bol úspešne uložený", data });
  } catch (err) {
    if (err instanceof Error) {
      return error(400, { message: err.message });
    } else {
      return error(400, { message: "Neznáma chyba" });
    }
  }
};
const GET = async ({ url }) => {
  try {
    const subtabId = url.searchParams.get("subtabId");
    if (!subtabId) {
      return json({ message: "SubtabId je povinný parameter" }, { status: 400 });
    }
    const { data, error: error2 } = await supabase.from("official_content").select("id, content_type, content, created_at").eq("subtab_id", subtabId);
    if (error2) {
      throw new Error(error2.message);
    }
    return json({ content: data });
  } catch (err) {
    if (err instanceof Error) {
      return json({ message: err.message }, { status: 400 });
    } else {
      return json({ message: "Neznáma chyba" }, { status: 500 });
    }
  }
};
const DELETE = async ({ url, locals }) => {
  if (!locals.isAdmin) {
    throw error(401, "Unauthorized");
  }
  const id = url.searchParams.get("id");
  if (!id) {
    return json({ message: "ID param je povinný." }, { status: 400 });
  }
  try {
    const { error: deleteError } = await supabase.from("official_content").delete().eq("id", id);
    if (deleteError) {
      console.error(deleteError);
      return json({ message: "Mazanie obsahu zlyhalo." }, { status: 500 });
    }
    return json({ message: "Obsah bol úspešne odstránený." }, { status: 200 });
  } catch (err) {
    if (err instanceof Error) {
      return json({ message: err.message }, { status: 500 });
    }
    return json({ message: "Neznáma chyba." }, { status: 500 });
  }
};
const PATCH = async ({ request, locals }) => {
  if (!locals.isAdmin) {
    throw error(401, "Unauthorized");
  }
  const body = await request.json();
  const { id, content } = body;
  if (!id || !content) {
    throw error(400, "id and content are required");
  }
  const { error: err } = await supabase.from("official_content").update({ content }).eq("id", id);
  if (err) {
    console.error(err);
    throw error(500, "Failed to update content");
  }
  return new Response(null, { status: 204 });
};
export {
  DELETE,
  GET,
  PATCH,
  POST
};

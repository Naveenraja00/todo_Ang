import { parseStringPromise } from "xml2js";

export async function xmlToJson(xml: string) {
  try { return await parseStringPromise(xml); }
  catch { return { raw: xml }; }
}

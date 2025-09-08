import type { DefaultNodeTypes } from "@payloadcms/richtext-lexical";
import { type JSXConvertersFunction } from "@payloadcms/richtext-lexical/react";

export const Converter: JSXConvertersFunction<DefaultNodeTypes> = ({
  defaultConverters,
}) => ({
  ...defaultConverters,
});

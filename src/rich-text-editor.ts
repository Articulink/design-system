/**
 * @articulink/design-system/rich-text-editor
 *
 * Separate entry point for the TipTap-based RichTextEditor so that apps
 * which don't use it never bundle TipTap. Requires the TipTap peer
 * dependencies — see the component's docs.
 */
export { RichTextEditor } from './components/RichTextEditor';
export type { RichTextEditorProps } from './components/RichTextEditor';

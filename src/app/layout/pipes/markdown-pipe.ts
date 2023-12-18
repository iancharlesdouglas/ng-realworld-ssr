import { Pipe, PipeTransform } from "@angular/core";
import { marked } from "marked";

/**
 * Transforms markdown text into HTML text
 */
@Pipe({ name: 'markdown', standalone: true })
export class MarkdownPipe implements PipeTransform {
  transform(value: string) {
    return marked(value);
  }
}

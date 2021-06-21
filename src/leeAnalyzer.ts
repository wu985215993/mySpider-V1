import { Analyzer } from './crowller'
export default class DellAnalyzer implements Analyzer {
  public analyze(html: string, filePath: string) {
    return html
  }
}

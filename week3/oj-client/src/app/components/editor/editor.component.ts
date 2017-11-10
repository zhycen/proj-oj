import { Component, OnInit, Inject} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

declare var ace: any;

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {

  editor: any;
  sessionId: string;

  public languages: string[] = ["Java", "C++", "Python"];
  language: string = "Java";

  defaultContent: object = {
'Java': `public class Solution {
  public statuc void main(String[] args) {
    // type your Java code here
  }
}`,
'C++': `#include <iostream>
using namespace std;

int main() {
  // Type your C++ code here
  return 0;
}
`,
'Python' : `class Solution:
  def example():
  # Write your Python code here`
  };

  langMap: object = {
    'Java' : 'java',
    'C++' : 'c_cpp',
    'Python' : 'python'
  }

  constructor(@Inject('collaboration') private collaboration,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params
      .subscribe(params => {
        this.sessionId = params['id'];
        this.initEditor();
      });
    }


  initEditor(){
    this.editor = ace.edit("editor");
    this.editor.setTheme('ace/theme/eclipse');
    this.resetEditor();
    this.editor.$blockScrolling = Infinity;

    document.getElementsByTagName('textarea')[0].focus();

    this.collaboration.init(this.editor, this.sessionId);
    this.editor.lastAppliedChange = null;

    this.editor.on('change' , (e) => {
      console.log('editor changes: ' + JSON.stringify(e));
      if (this.editor.lastAppliedChange != e) {
        this.collaboration.change(JSON.stringify(e));
      }
    })
  }

  setLanguage(language: string) {
    this.language = language;
    this.resetEditor();
  }

  resetEditor(): void {
    this.editor.getSession().setMode('ace/mode/'+this.langMap[this.language]);
    this.editor.setValue(this.defaultContent[this.language]);
  }

  submit(): void {
    let userCode = this.editor.getValue();
    console.log(userCode);
  }
}
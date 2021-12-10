import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ClickOutsideDirective} from './core/directive/click-outside.directive';
import {TemplateNode1Component} from "./component/template-node-1/template-node-1.component";
import {TemplateNode2Component} from "./component/template-node-2/template-node-2.component";
import {TemplateNode3Component} from "./component/template-node-3/template-node-3.component";
import {TemplateNode4Component} from "./component/template-node-4/template-node-4.component";
import {SharedModule} from "./shared/shared.module";

@NgModule({
  declarations: [
    AppComponent,
    ClickOutsideDirective,
    TemplateNode1Component,
    TemplateNode2Component,
    TemplateNode3Component,
    TemplateNode4Component,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}

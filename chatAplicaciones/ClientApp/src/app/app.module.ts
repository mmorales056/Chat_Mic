import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { ChatComponent } from './chat/chat.component';


@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,    
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      { path: 'chat/:IdAplicacion/:Usuario/:doc1', component: ChatComponent, pathMatch: 'full' },
      { path: 'chat/:IdAplicacion/:Usuario/:doc1/:doc2', component: ChatComponent, pathMatch: 'full' },
      { path: 'chat/:IdAplicacion/:Usuario/:doc1/:doc2/:doc3', component: ChatComponent, pathMatch: 'full' },
      { path: 'chat/:IdAplicacion/:Usuario/:doc1/:doc2/:doc3/:doc4', component: ChatComponent, pathMatch: 'full' },
      
  
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

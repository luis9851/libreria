import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'libreria';

  
  ngOnInit(): void {
   

    (function(d, m){
      var kommunicateSettings = {"appId":"335ef30a9e4db9ef23a5cfa4eece0b21b","popupWidget":true,"automaticChatOpenOnNavigation":true};
      var s = document.createElement("script"); s.type = "text/javascript"; s.async = true;
      s.src = "https://widget.kommunicate.io/v2/kommunicate.app";
      var h = document.getElementsByTagName("head")[0]; h.appendChild(s);
      (window as any).kommunicate = m; m._globals = kommunicateSettings;
      console.log(kommunicateSettings)
  })(document, (window as any).kommunicate || {});
  }
}

import { Component, OnInit, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { MapService } from "../services/map.service";
import { LocalizationService } from "../../@core/internationalization/localization.service";
import { Descriptor } from "../../@core/interfaces";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  providers: [MessageService]
})

export class MainComponent implements OnInit, AfterContentChecked {
  public openMenu: boolean;
  public showLayers: boolean;
  public limit: any;
  public descriptor: Descriptor;
  public showMessage: boolean;
  public showTerms: boolean;
  public acceptTerms:boolean;
  public isMobile: boolean;
  constructor(
    private mapService: MapService,
    private localizationService: LocalizationService,
    private cdRef: ChangeDetectorRef,
    protected messageService: MessageService,
  ) {
    this.showTerms = false;
    this.acceptTerms = false;
    this.openMenu = true;
    this.showLayers = false;
  }

  ngOnInit(): void {

    //IF para identificar quando o caso é mobile.
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
      this.isMobile = true;
    } else{
      this.isMobile = false;
    }
    this.showMessage = true;
    let acceptTerms = localStorage.getItem('acceptTerms');

    if (acceptTerms === 'false' || acceptTerms === null){
      this.acceptTerms = false;
    }else{
      this.acceptTerms = true;
      this.showMessage = false
    }

    console.log(this.acceptTerms,this.showMessage)
    this.getDescriptor();
  }
  ngAfterContentChecked(): void {
    this.cdRef.detectChanges();
  }

  getDescriptor() {
    this.mapService.getDescriptor(this.localizationService.currentLang()).subscribe((descriptor: Descriptor) => {
      setTimeout(() => this.descriptor = descriptor, 0);
    }, error => {
      console.error(error)
    });
  }

  onMenuSelected(item) {
    this.showLayers = item.show;
  }

  onSideBarToggle(isOpen) {
    this.showLayers = isOpen;
  }

  onMenuToggle(isOpen) {
    this.openMenu = isOpen;
  }

  onChangeLanguage() {
    this.getDescriptor();
  }

  onMessageHide(evt){
    if(this.acceptTerms){
      localStorage.setItem('acceptTerms', 'true');
      this.showMessage = false;
    } else{
      this.showMessage = true;
      this.messageService.add({
        life: 2000,
        severity: 'error',
        summary: this.localizationService.translate('terms.error_title'),
        detail: this.localizationService.translate('terms.error_msg', )
      });
    }
  }

  changeTerms(evt){
    this.acceptTerms = evt.checked
    localStorage.setItem('acceptTerms', evt.checked ? 'true' : 'false');
  }


}


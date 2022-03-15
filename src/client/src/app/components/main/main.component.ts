import { Component, OnInit, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { MapService } from "../services/map.service";
import { LocalizationService } from "../../@core/internationalization/localization.service";
import { Descriptor } from "../../@core/interfaces";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})

export class MainComponent implements OnInit, AfterContentChecked {
  public openMenu: boolean;
  public showLayers: boolean;
  public limit: any;
  public descriptor: Descriptor;
  public showMessage: boolean;
  public isMobile: boolean;
  constructor(
    private mapService: MapService,
    private localizationService: LocalizationService,
    private cdRef: ChangeDetectorRef
  ) {
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
    let showMessage = localStorage.getItem('showMessage');

    if (showMessage === 'false' || showMessage === null){
      this.showMessage = true;
    }else{
      this.showMessage = false;
    }
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
    localStorage.setItem('showMessage', 'true');
    this.showMessage = false;
  }
}


import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss']
})
export class FolderPage implements OnInit {
  public folder: string;
  scanSubscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private qrScanner: QRScanner,
    public toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');
  }

  ionViewWillEnter() {
    this.scan();
  }
  ionViewWillLeave() {
    this.stopScanning();
  }

  scan() {
    (window.document.querySelector('ion-app') as HTMLElement).classList.add(
      'cameraView'
    );
    this.qrScanner
      .prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          this.qrScanner.show();
          this.scanSubscription = this.qrScanner
            .scan()
            .subscribe(async (text: string) => {
              const toast = await this.toastCtrl.create({
                message: `${text}`,
                position: 'top',
                duration: 3000,
                buttons: [
                  {
                    text: 'Done',
                    role: 'cancel',
                    handler: () => {
                      console.log('Cancel clicked');
                    }
                  }
                ]
              });
              toast.present();
            });
        } else {
          console.error('Permission Denied', status);
        }
      })
      .catch((e: any) => {
        console.error('Error', e);
      });
  }

  stopScanning() {
    // tslint:disable-next-line:no-unused-expression
    this.scanSubscription ? this.scanSubscription.unsubscribe() : null;
    this.scanSubscription = null;
    (window.document.querySelector('ion-app') as HTMLElement).classList.remove(
      'cameraView'
    );
    this.qrScanner.hide();
    this.qrScanner.destroy();
  }
}

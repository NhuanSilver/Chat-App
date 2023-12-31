import {Injectable, OnDestroy} from "@angular/core";
import {Subscription} from "rxjs";
@Injectable()
export abstract class BaseComponent implements OnDestroy{
  protected subscriptions : Subscription[] = []

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}

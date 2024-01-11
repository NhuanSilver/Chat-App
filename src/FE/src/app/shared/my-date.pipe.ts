import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'myDate',
  standalone: true
})
export class MyDatePipe implements PipeTransform {

  transform(value : Date): string {
    if (!value) return '';

    const currentDate = new Date();
    const messageDate = new Date(value);
    const differenceInSeconds = Math.floor((currentDate.getTime() - messageDate.getTime()) / 1000);

    switch (true) {
      case differenceInSeconds < 60:
        return 'Vài giây trước';
      case differenceInSeconds < 3600:
        const minutes = Math.floor(differenceInSeconds / 60);
        return `${minutes} ${minutes === 1 ? 'phút' : 'phút'} trước`;
      case differenceInSeconds < 86400:
        const hours = Math.floor(differenceInSeconds / 3600);
        return `${hours} ${hours === 1 ? 'giờ' : 'giờ'} trước`;
      case differenceInSeconds < 2592000:
        const days = Math.floor(differenceInSeconds / 86400);
        return `${days} ${days === 1 ? 'ngày' : 'ngày'} trước`;
      case differenceInSeconds < 31536000:
        const months = Math.floor(differenceInSeconds / 2592000);
        return `${months} ${months === 1 ? 'tháng' : 'tháng'} trước`;
      default:
        const years = Math.floor(differenceInSeconds / 31536000);
        return `${years} ${years === 1 ? 'năm' : 'năm'} trước`;
    }
  }

}

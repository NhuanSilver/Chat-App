import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'myDate',
  standalone: true
})
export class MyDatePipe implements PipeTransform {

  transform(value : Date, type ?: string): string {
    if (!value) return '';

    const currentDate = new Date();
    const messageDate = new Date(value);
    const differenceInSeconds = Math.floor((currentDate.getTime() - messageDate.getTime()) / 1000);
    if (type === 'detail') {
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
    } else {
      if (
        currentDate.getFullYear() === messageDate.getFullYear() &&
        currentDate.getMonth() === messageDate.getMonth() &&
        currentDate.getDate() === messageDate.getDate()
      ) {
        // Hiện thời gian trong ngày hiện tại
        const hours = messageDate.getHours();
        const minutes = messageDate.getMinutes();
        return `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
      } else if (
        currentDate.getFullYear() === messageDate.getFullYear() &&
        currentDate.getMonth() === messageDate.getMonth() &&
        currentDate.getDate() - messageDate.getDate() === 1
      ) {
        // Hiện mốc thời gian cộng với "Hôm qua"
        return `Hôm qua ${messageDate.getHours()}:${messageDate.getMinutes()}`;
      } else {
        // Hiện mốc thời gian cộng định dạng dd/mm/yyyy
        return  this.formatDate(messageDate);
      }
    }

  }
  private formatDate(date: Date): string {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day < 10 ? '0' : ''}${day}/${month < 10 ? '0' : ''}${month}/${year}`;
  }

}

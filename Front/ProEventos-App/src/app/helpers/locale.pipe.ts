import { formatDate } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe to transforma dates to locale date
 */

@Pipe({
  name: 'LocaleDatePipe'
})
export class LocaleDatePipe implements PipeTransform {
  private locale: string = 'en-US';

  /**
     * @param value Date to be modified
     * @param formatType Standards values, based in uses
     * @param format Custom format, if the 'standards' do not meet the need
     * @returns
     */

  transform(value: Date | string | number, formatType: DefaultFormats = DefaultFormats.full, format?: string): string | null {
    if (typeof value == "string") {
        value = new Date(Date.parse(value))
    } else {
        value =  value + 'Z'
    }
    return formatDate(value, this.getFormatByType(formatType, format), this.locale);
}

private getFormatByType(typed: DefaultFormats, format?: string) {
    if (format) {
        return format;
    }
    /**
     * Standards formats
     * @see Custom-formats: https://angular.io/api/common/DatePipe#custom-format-options
     */
    switch(typed) {
        case DefaultFormats.short: {
            return "dd/MM/yyyy";
        }
        case DefaultFormats.hours: {
            return "HH:mm:ss";
        }
        case DefaultFormats.full: {
            return "dd/MM/yyyy \'às' HH:mm";
        }
    }
  }

}

enum DefaultFormats {
  short = "short",
  hours = "hours",
  full = "full"
}

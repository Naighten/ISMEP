import { Component, OnInit } from '@angular/core';

export interface Message {
  img: string
  name: string
  desc: string
  youActive: boolean
  isActive: boolean
  isOnline: boolean
  dialog: Dialog[]
}

export interface Dialog {
  name: string
  img: string
  time: string
  isFile: boolean
  text: string
}

@Component({
  selector: 'app-messenger',
  templateUrl: './messenger.component.html',
  styleUrls: ['./messenger.component.scss']
})
export class MessengerComponent implements OnInit {

  messages: Message[] = [
    {
      img: '../../../assets/img/avatar-2.png',
      name: 'Дмитрий Понасенков',
      desc: 'Привет как там с отчетностью по поводу....',
      youActive: false,
      isActive: true,
      isOnline: true,
      dialog: [
        {
          name: 'Дмитрий',
          img: '../../../assets/img/avatar-2.png',
          time: '10:33',
          isFile: false,
          text: 'Кстати насчет отчетности, стоит добавить пункт с расходами и оформить несколько графиков в этой тематике.'
        },
        {
          name: 'Николай',
          img: '../../../assets/img/avatar-5.png',
          time: '10:35',
          isFile: false,
          text: 'да, хорошо, Анастасия уже посвятила меня в курс дела'
        },
        {
          name: 'Николай',
          img: '../../../assets/img/avatar-5.png',
          time: '16:72',
          isFile: true,
          text: 'Отчетность с графиками.docx'
        },
        {
          name: 'Дмитрий',
          img: '../../../assets/img/avatar-2.png',
          time: '19:40',
          isFile: false,
          text: 'отлично!'
        },
        {
          name: 'Дмитрий',
          img: '../../../assets/img/avatar-2.png',
          time: '10:33',
          isFile: false,
          text: 'Привет как там с отчетностью по поводу предстоящей презентации нового продукта?'
        },
      ]
    },
    {
      img: '../../../assets/img/avatar-3.png',
      name: 'Лидия Краснова',
      desc: 'хорошо, пришлю к субботе! а что насчет графиков в презента...',
      youActive: true,
      isActive: false,
      isOnline: false,
      dialog: [
        {
          name: 'Николай',
          img: '../../../assets/img/avatar-5.png',
          time: '10:35',
          isFile: false,
          text: 'Добрый день, как у вас дела?'
        },
        {
          name: 'Николай',
          img: '../../../assets/img/avatar-5.png',
          time: '16:72',
          isFile: false,
          text: 'Нужно срочно доделать презентацию проекта, через 3 дня уже выступаем, ты успеваешь или тебе выслать на помощь людей?'
        },
        {
          name: 'Лидия',
          img: '../../../assets/img/avatar-3.png',
          time: '19:40',
          isFile: false,
          text: 'Здравствуйте, все хорошо, лучше я одна'
        },
        {
          name: 'Лидия',
          img: '../../../assets/img/avatar-3.png',
          time: '10:33',
          isFile: false,
          text: 'хорошо, пришлю к субботе! а что насчет графиков в презентации?'
        },
        {
          name: 'Николай',
          img: '../../../assets/img/avatar-5.png',
          time: '10:35',
          isFile: false,
          text: 'Добрый день, как у вас дела?'
        },
        {
          name: 'Николай',
          img: '../../../assets/img/avatar-5.png',
          time: '16:72',
          isFile: false,
          text: 'Нужно срочно доделать презентацию проекта, через 3 дня уже выступаем, ты успеваешь или тебе выслать на помощь людей?'
        },
        {
          name: 'Лидия',
          img: '../../../assets/img/avatar-3.png',
          time: '19:40',
          isFile: false,
          text: 'Здравствуйте, все хорошо, лучше я одна'
        },
        {
          name: 'Лидия',
          img: '../../../assets/img/avatar-3.png',
          time: '10:33',
          isFile: false,
          text: 'хорошо, пришлю к субботе! а что насчет графиков в презентации?'
        },
        {
          name: 'Николай',
          img: '../../../assets/img/avatar-5.png',
          time: '10:35',
          isFile: false,
          text: 'Добрый день, как у вас дела?'
        },
        {
          name: 'Николай',
          img: '../../../assets/img/avatar-5.png',
          time: '16:72',
          isFile: false,
          text: 'Нужно срочно доделать презентацию проекта, через 3 дня уже выступаем, ты успеваешь или тебе выслать на помощь людей?'
        },
        {
          name: 'Лидия',
          img: '../../../assets/img/avatar-3.png',
          time: '19:40',
          isFile: false,
          text: 'Здравствуйте, все хорошо, лучше я одна'
        },
        {
          name: 'Лидия',
          img: '../../../assets/img/avatar-3.png',
          time: '10:33',
          isFile: false,
          text: 'хорошо, пришлю к субботе! а что насчет графиков в презентации?'
        },
      ]
    },
    {
      img: '../../../assets/img/avatar-4.png',
      name: 'Анатолий Семашко',
      desc: '',
      youActive: false,
      isActive: false,
      isOnline: false,
      dialog: []
    },
  ]

  public messageText: string = ''
  constructor() { }

  ngOnInit(): void {
  }

  rightDialog: Message = this.messages[0]
  toggleDialog(message: Message) {
    for (let i = 0; i < this.messages.length; i++) {
      if (message === this.messages[i]) {
        this.rightDialog.isActive = false
        this.rightDialog = this.messages[i]
        this.messages[i].isActive = true
        break
      }
    }
  }

  sendMessage(rightDialog: Message, messageText: string) {
    rightDialog.dialog.push(
      {
        name: 'Николай',
        img: '../../../assets/img/avatar-5.png',
        time: '10:33',
        isFile: false,
        text: messageText
      }
    )
    this.messageText = ''
  }

}

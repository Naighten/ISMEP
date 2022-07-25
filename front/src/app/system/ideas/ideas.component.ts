import { Component, OnInit } from '@angular/core';

export interface Idea {
  author: string;
  title: string;
  text: string;
  like: number;
  dislike: number;
  numComments: number;
  isActiveComment: boolean;
  comments: {
    author: string;
    title: string;
    text: string;
  }[]
}

@Component({
  selector: 'app-ideas',
  templateUrl: './ideas.component.html',
  styleUrls: ['./ideas.component.scss']
})
export class IdeasComponent implements OnInit {

  ideas: Idea[] = [
    {
      author: '../../../assets/img/avatar-1.png',
      title: 'Восхитительное предложение',
      text: 'Не стану тут долго расписывать, что же такое блины, думаю, вы и так все знаете. Блины бывают дрожжевые и бездрожжевые, мы будем готовить простые бездрожжевые блины на молоке. У меня вопрос лишь в том, как правильно их назвать, блины или всё же блинчики, если речь идёт именно о тонких блинах. Я всегда считала, что блин — это тонко пожаренное тесто на сковороде, а блинчик — это блин, в который завернули начинку. Однако покопавшись в истории этого блюда, я склоняюсь к тому, что мы всё же приготовим с вами сегодня тонкие блинчики на молоке. Потому как традиционные русские блины пеклись из густого дрожжевого теста и были довольно толстые. Тонкие же блины пришли к нам из Франции, и стали называться блинчиками, они могут быть как с начинкой, так и без неё, ведь только в тонкий блинчик вы сможете завернуть начинку. И хотя со словом, вроде, всё понятно, я иногда по-прежнему продолжаю называть тонкие блинчики — блинами.',
      like: 17,
      dislike: 3,
      numComments: 2,
      isActiveComment: false,
      comments: [
        {
          author: '../../../assets/img/avatar-1.png',
          title: 'Эдуард Припусков',
          text: 'Чудесная идея полностью вас поддерживаю!!'
        },
        {
          author: '../../../assets/img/avatar-1.png',
          title: 'Эдуард Припусков',
          text: 'Чудесная идея полностью вас поддерживаю!!'
        },
      ]
    },
    {
      author: '../../../assets/img/avatar-1.png',
      title: 'Восхитительное предложение',
      text: 'Не стану тут долго расписывать, что же такое блины, думаю, вы и так все знаете. Блины бывают дрожжевые и бездрожжевые, мы будем готовить простые бездрожжевые блины на молоке. У меня вопрос лишь в том, как правильно их назвать, блины или всё же блинчики, если речь идёт именно о тонких блинах. Я всегда считала, что блин — это тонко пожаренное тесто на сковороде, а блинчик — это блин, в который завернули начинку. Однако покопавшись в истории этого блюда, я склоняюсь к тому, что мы всё же приготовим с вами сегодня тонкие блинчики на молоке. Потому как традиционные русские блины пеклись из густого дрожжевого теста и были довольно толстые. Тонкие же блины пришли к нам из Франции, и стали называться блинчиками, они могут быть как с начинкой, так и без неё, ведь только в тонкий блинчик вы сможете завернуть начинку. И хотя со словом, вроде, всё понятно, я иногда по-прежнему продолжаю называть тонкие блинчики — блинами.',
      like: 17,
      dislike: 3,
      numComments: 1,
      isActiveComment: false,
      comments: [
        {
          author: '../../../assets/img/avatar-1.png',
          title: 'Эдуард Припусков',
          text: 'Чудесная идея полностью вас поддерживаю!!'
        },
      ]
    },
  ]

  public ideaText: string = ''
  public commentText: string = ''
  constructor(
  ) { }

  ngOnInit(): void {
  }

  likeIdea(idea: Idea) {
    idea.like++
    // idea.dislike--
  }

  dislikeIdea(idea: Idea) {
    idea.dislike++
    // idea.like--
  }

  commentsIdea(idea: Idea) {
    idea.isActiveComment = !idea.isActiveComment
  }

  sendIdea(idea: string) {
    this.ideas.push({
      author: '../../../assets/img/avatar-1.png',
      title: 'Восхитительное предложение',
      text: String(idea),
      like: 0,
      dislike: 0,
      numComments: 0,
      isActiveComment: false,
      comments: []
    })
  }

  sendComment(idea: Idea, commentText: string) {
    idea.comments.push({
      author: '../../../assets/img/avatar-1.png',
      title: 'Эдуард Припусков',
      text: commentText
    })
    idea.numComments++
    this.commentText = ''
  }

}

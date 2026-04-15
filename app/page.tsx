import { Faq } from "@/components/Faq";
import { FormSection } from "@/components/FormSection";
import { PhotoSectionHousing } from "@/components/PhotoSectionHousing";
import styles from "./page.module.css";
import Image from "next/image";

const signs = [
  ["Овен", "/images/sign-aries.png"],
  ["Телец", "/images/sign-taurus.png"],
  ["Близнецы", "/images/sign-gemini.png"],
  ["Рак", "/images/sign-cancer.png"],
  ["Лев", "/images/sign-leo.png"],
  ["Дева", "/images/sign-virgo.png"],
  ["Весы", "/images/sign-libra.png"],
  ["Скорпион", "/images/sign-scorpio.png"],
  ["Стрелец", "/images/sign-sagittarius.png"],
  ["Козерог", "/images/sign-capricorn.png"],
  ["Водолей", "/images/sign-aquarius.png"],
  ["Рыбы", "/images/sign-pisces.png"],
] as const;

const faqs = [
  {
    question: "Что такое асцендент и как его узнать?",
    answer:
      "Асцендент — это знак, который поднимался на восточном горизонте в момент рождения. Для точного расчета нужны дата, время и место рождения.",
  },
  {
    question:
      "Мне выбрать прогноз для моего солнечного знака или по асценденту?",
    answer:
      "Прогноз по солнечному знаку лучше отражает личные процессы, а по асценденту — то, как вы проявляетесь во внешнем мире. Для полной картины удобнее ориентироваться на оба.",
  },
  {
    question: "Оплатили прогноз! Когда он придет?",
    answer:
      "После оплаты письмо обычно приходит на указанную почту автоматически. Если письма нет, стоит проверить папки со спамом и промоакциями.",
  },
  {
    question: "Как скоро будет готов мой персональный прогноз?",
    answer:
      "Срок зависит от формата прогноза, но в scaffold это оставлено как контентный блок без привязки к оплате или fulfillment-логике.",
  },
  {
    question: "Я родилась на стыке знаков, как понять, какой мой?",
    answer:
      "На стыке ориентироваться лучше не по популярным таблицам, а по точной дате, времени и месту рождения.",
  },
  {
    question: "Что делать, если солнечный знак и знак асцендента совпадают?",
    answer:
      "Это нормальная ситуация. В таком случае оба прогноза будут усиливать друг друга и показывать похожие акценты года.",
  },
  {
    question: "Что делать, если я неверно указала почту при оформлении заказа?",
    answer:
      "На оригинальном сайте для таких случаев был отдельный вопрос в FAQ. В этом scaffold это оставлено как статическая подсказка без почтовой логики.",
  },
  {
    question: "Оплата только картой РФ?",
    answer:
      "Платежная логика в восстановленный scaffold не входит. Секция сохранена как контентный макет для дальнейшей подстановки вашего способа оплаты.",
  },
];

function LayeredTitle({
  front,
  shadow,
  white = false,
}: {
  front: string;
  shadow?: string;
  white?: boolean;
}) {
  return (
    <span className={`${styles.title} ${white ? styles.titleWhite : ""}`}>
      <span className={styles.titleShadow} aria-hidden="true">
        {shadow ?? front}
      </span>
      <span className={styles.titleFront}>{front}</span>
    </span>
  );
}

export default function HomePage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <Image
          src="/images/biarriz-1-3 1.png"
          alt="Биарриц"
          fill
          priority
          className={styles.heroBg}
        />
        <div className={styles.heroShade} aria-hidden="true" />
        <div className={styles.heroContent}>
          <h1 className={styles.heroDates}>18 — 21 июня 2026</h1>
          <div className={styles.heroTextBlock}>
            <p className={styles.heroKicker}>Венера во Льве</p>
            <p className={styles.heroHeadline}>Меркурий в Биаррице</p>
          </div>
          <a className={styles.heroCtaLink} href="#hero-scroll-target">
            <img
              src="/images/ХОЧУ-С-ВАМИ 1.png"
              alt="Хочу с вами"
              className={styles.heroCtaImage}
            />
          </a>
          <img
              src="/images/icon.svg"
              alt="Icon"
              className={styles.heroIcon}
            />
        </div>
      </section>
      <section className={styles.forecastSection}>
        <div className={`${styles.sectionInner} ${styles.forecastScene}`}>
          <h2 className={styles.sectionTitle}>
            <LayeredTitle front="Привет любименькие!" />
          </h2>
            <div className={styles.forecastText}>
              <p>
              Пару лет назад мы с моим мужем Егориком оказались в Биарриц, и просто ошалели от счастья. Честное слово, я недавно посмотрела кино, где после окончания жизни всем нужно было выбрать место, где провести вечность, и когда стала описывать своё, то сообразила, что описываю Биарриц. Получается, что я нашла лучшее место на Земле. Ну, по крайней мере, для себя.
              </p>
              <p>
              Когда приезжают друзья, мне нравится показывать Биарриц таким, как вижу его я: свободолюбивым и аристократичным. За одним столиком в центре города прекрасно уживаются старушка в Шанель и сёрфер в мокром костюме. Он целует её, она отмахивается, хохочет и жалуется, что она замочил её блузку. Я люблю водить друзей туда, куда хожу сама. Вот тут мы завтракаем после пилатеса, а в этой рыбной лавке лучшие севиче и устрицы. Мы ходим в неё по пятницам ровно к 19 часам. Сюда мы заглядываем на бокал шампанского перед балетом. Это любимый ресторан писателя Василия Аксенова. В общем, я очень люблю все эти места, и мне хочется поделиться ими с вами. С теми, кто вместе со мной каждый  день пытается разобраться, что вообще такое творится на этой безумной планете. 
              </p>
              <p>
              Нас ждут простые удовольствия. Океан, вино, пилатес, пробежки, круассаны, устрицы, серфинг (ну или серферы), экскурсии с классным гидом, аперитивы в саду, закаты, шампанское и ответы на самые важные вопросы. В общем, три дня чистой радости и отсутствия противных людей в довольно большом радиусе.
              </p>
              <p>
              Ещё нас ждет особенный вечер: ужин на нашей вилле с французским шеф-поваром Адрианом Витте. Его отмечал Мишлен, и мы с Егориком: ресторан, в котором он работал над картой, наш самый любимый в Биарриц. Помимо гастрономических радостей, в этот вечер я обязательно расскажу вам про грядущий ретроградный Меркурий, смену кармических узлов, дам астрологические подсказки на всё лето и может быть даже раскидаем Таро после десерта или придумаем что-нибудь еще.  Вдобавок вас ждут всякие маленькие приятные астрологические сюрпризы и чат, в котором мы заранее обсудим, что вам будет интереснее и важнее разузнать. А я подготовлюсь к нашей встрече особенно тщательно.
              </p>
            </div>
        </div>
      </section>

      <PhotoSectionHousing />
      <FormSection />





      {/* <section className={styles.forecastSection}>
        <div className={`${styles.sectionInner} ${styles.forecastScene}`}>
          <h2 className={styles.sectionTitle}>
            <LayeredTitle front="Где мы будем жить" />
          </h2>
            <div className={styles.forecastText}>
              <h3 className={styles.forecastSubtitle}>Биарриц</h3>
              <p>
                Лучший город Земли на побережье Атлантики. Французская культура, совсем не похожая на то, что вы видели в Париже. Феерические виды на океан и Пиренеи, просторные пляжи, вкусная еда, локальные лавки с продуктами и классными, известными и аутентичными брендами одежды, но самое главное — энергия океана, от которой все проблемы становятся крошечными, а тревогу убаюкивает шум волн.
              </p>
              <h3 className={styles.forecastSubtitle}>Наш дом</h3>
              <p>
                Лучший город Земли на побережье Атлантики. Французская культура, совсем не похожая на то, что вы видели в Париже. Феерические виды на океан и Пиренеи, просторные пляжи, вкусная еда, локальные лавки с продуктами и классными, известными и аутентичными брендами одежды, но самое главное — энергия океана, от которой все проблемы становятся крошечными, а тревогу убаюкивает шум волн.
              </p>
              <p>
              * С нами на территории будет собака, пожалуйста, учтите это, если у вас аллергия.
              </p>
            </div>
        </div>
      </section>

      <section className={styles.aboutSection}>
        <div className={`${styles.sectionInner} ${styles.aboutScene}`}>
          <h2 className={styles.sectionTitle}>
            <LayeredTitle front="обо мне" />
          </h2>
          <div className={styles.aboutGrid}>
            <div className={styles.aboutPortraitWrap}>
              <img
                src="/images/about-portrait.png"
                alt="Оля Осипова"
                className={styles.aboutPortrait}
              />
            </div>
            <div className={styles.aboutCopy}>
              <h3 className={styles.aboutName}>Оля Осипова</h3>
              <p>
                Астролог, писатель, журналист и автор популярного блога
                «Ретроградный Меркурий» для тех, кто приуныл, но не планировал
                сдаваться. И для остальных.
              </p>
              <div className={styles.socials}>
                <a
                  href="https://www.instagram.com/retrogradnymercury"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src="/images/about-instagram.png"
                    alt=""
                    aria-hidden="true"
                  />
                  450 тысяч подписчиков
                </a>
                <a
                  href="https://t.me/retrogrademercury"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src="/images/about-telegram.png"
                    alt=""
                    aria-hidden="true"
                  />
                  160 тысяч подписчиков
                </a>
              </div>
              <p className={styles.metaNote}>
                *проект Meta Platforms Inc., деятельность которой в России
                запрещена
              </p>
            </div>
            <div className={styles.bookCard}>
              <img
                src="/images/about-book.png"
                alt="Как обвести луну вокруг пальца"
              />
              <p>
                Автор астрологического бестселлера «Как обвести луну вокруг
                пальца»
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.chooseSection} id="how-to-choose">
        <div className={`${styles.sectionInner} ${styles.chooseScene}`}>
          <h2 className={styles.sectionTitle}>
            <LayeredTitle front="как выбрать?" />
          </h2>
          <div className={styles.chooseIntro}>
            <div>
              <h3 className={styles.chooseHeading}>Какой прогноз выбрать?</h3>
              <p className={styles.chooseSubheading}>
                По знаку зодиака или асценденту
              </p>
            </div>
            <img
              src="/images/how-choose-hand-sphere.png"
              alt="Сфера со знаком зодиака"
              className={styles.chooseSphere}
            />
          </div>

          <div className={styles.chooseColumns}>
            <article className={styles.chooseCard}>
              <p>
                Знак вашего асцендента влияет на то, как вы взаимодействуете с
                внешним миром, какие принимаете решения и как вас воспринимают
                окружающие. Если вас интересует больше проявление вовне, лучше
                сверяться с прогнозом по знаку асцендента.
              </p>
              <img
                src="/images/how-choose-earth.png"
                alt="Сфера со знаком зодиака"
                className={styles.chooseDecoration}
              />
            </article>
            <article className={styles.chooseCard}>
              <p>
                Ваш обычный солнечный знак влияет на перемены, связанные именно
                с вами, вашей личностью и вашей энергией. Если вас больше
                интересуют внутренние процессы, ориентируйтесь на прогноз по
                солнечному знаку.
              </p>
              <img
                src="/images/how-choose-dog.png"
                alt="Собака спит на планете"
                className={styles.chooseDecoration}
              />
            </article>
          </div>

          <ul className={styles.signGrid}>
            {signs.map(([label, src]) => (
              <li key={label} className={styles.signItem}>
                <img src={src} alt={label} className={styles.signImage} />
                <span>{label}</span>
              </li>
            ))}
          </ul>

          <div className={styles.chooseSummary}>
            <p>
              Для более полной картины рекомендуется ориентироваться сразу на
              оба прогноза. Так вы сможете подготовиться к будущему году
              аккуратнее и лучше понять, когда стоит заявлять о себе, а когда —
              затаиться.
            </p>
            <p className={styles.discountNote}>
              Кроме того, после покупки первого прогноза вы получите скидку 50%
              на покупку второго.
            </p>
          </div>

          <div className={styles.chooseFloatingArt} aria-hidden="true">
            <img src="/images/how-choose-flying-dog.png" alt="" />
            <img src="/images/how-choose-ufo.png" alt="" />
            <img src="/images/how-choose-decorations.png" alt="" />
          </div>
        </div>
      </section>

      <section className={styles.giftSection}>
        <div className={`${styles.sectionInner} ${styles.giftScene}`}>
          <div className={styles.giftGrid}>
            <div>
              <h2 className={styles.sectionTitle}>
                <LayeredTitle front="прогноз в подарок" />
              </h2>
              <p>
                Не знаете знак зодиака? Подарите сертификат с прогнозом, и
                человек, которому вы делаете подарок, сам выберет свой знак.
              </p>
              <p>
                Мы пришлем вам сертификат с уникальной ссылкой на прогноз,
                который удобно отправить в любом мессенджере. Знак можно выбрать
                позже.
              </p>
            </div>
            <img
              src="/images/gift-olya.png"
              alt="Подарочный прогноз"
              className={styles.giftImage}
            />
          </div>
        </div>
      </section> */}

      <section className={styles.questionsSection}>
        <div className={`${styles.sectionInner} ${styles.questionsScene}`}>
          <div className={styles.questionsHeader}>
            <h2 className={styles.sectionTitle}>
              <LayeredTitle front="вопросы" />
            </h2>
            <img
              src="/images/questions-birds.png"
              alt="Птицы"
              className={styles.birds}
            />
          </div>
          <Faq items={faqs} />
        </div>
      </section>

      <section className={styles.reviewsSection}>
        <div className={`${styles.sectionInner} ${styles.reviewsScene}`}>
          <h2 className={styles.sectionTitle}>
            <LayeredTitle front="отзывы" />
          </h2>
          <div className={styles.reviewsFrame}>
            <img
              src="/images/reviews-decor-left.png"
              alt=""
              aria-hidden="true"
              className={styles.reviewsDecorLeft}
            />
            <div className={styles.device}>
              <img
                src="/images/reviews-device.png"
                alt=""
                aria-hidden="true"
                className={styles.deviceMobile}
              />
              <img
                src="/images/reviews-device-desktop.png"
                alt=""
                aria-hidden="true"
                className={styles.deviceDesktop}
              />
              <div className={styles.screen}>
                <img
                  src="/images/reviews-bg-mobile.png"
                  alt=""
                  aria-hidden="true"
                  className={styles.screenMobile}
                />
                <img
                  src="/images/reviews-bg-desktop.png"
                  alt=""
                  aria-hidden="true"
                  className={styles.screenDesktop}
                />
                <div className={styles.messageWrap}>
                  <img
                    src="/images/review-msg-1.png"
                    alt="Отзыв"
                    className={styles.messageMobile}
                  />
                  <img
                    src="/images/review-msg-desktop-1.webp"
                    alt="Отзыв"
                    className={styles.messageDesktop}
                  />
                </div>
              </div>
            </div>
            <img
              src="/images/reviews-decor-right.png"
              alt=""
              aria-hidden="true"
              className={styles.reviewsDecorRight}
            />
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <a
            className={styles.footerQuestion}
            href="https://t.me/rmzabota"
            target="_blank"
            rel="noreferrer"
          >
            <img
              src="/images/footer-question.webp"
              alt="Задать вопрос"
              className={styles.footerQuestionMobile}
            />
            <img
              src="/images/footer-question-desktop.webp"
              alt="Задать вопрос"
              className={styles.footerQuestionDesktop}
            />
          </a>
          <div className={styles.footerLinks}>
            <a
              href="https://docs.google.com/document/d/1FPJ6FnoR6c8xYjg3LGgZ2lMB_Guj2tl0ZA-KS4KW54U/edit?tab=t.0"
              target="_blank"
              rel="noreferrer"
            >
              Публичная оферта.
            </a>
            <a
              href="https://docs.google.com/document/d/1AGLc2Liem0PR6PenVA2jwC-SHSXZX-fCkYu4mtbktW0/edit?tab=t.0"
              target="_blank"
              rel="noreferrer"
            >
              Политика в отношении обработки и защиты персональных данных
            </a>
          </div>
          <img
            src="/images/footer-houses-back.webp"
            alt=""
            aria-hidden="true"
            className={styles.footerBackMobile}
          />
          <img
            src="/images/footer-houses-back-desktop.webp"
            alt=""
            aria-hidden="true"
            className={styles.footerBackDesktop}
          />
          <img
            src="/images/footer-moon.webp"
            alt=""
            aria-hidden="true"
            className={styles.footerMoonMobile}
          />
          <img
            src="/images/footer-moon-desktop.webp"
            alt=""
            aria-hidden="true"
            className={styles.footerMoonDesktop}
          />
          <img
            src="/images/footer-houses-front.webp"
            alt=""
            aria-hidden="true"
            className={styles.footerFrontMobile}
          />
          <img
            src="/images/footer-houses-front-desktop.webp"
            alt=""
            aria-hidden="true"
            className={styles.footerFrontDesktop}
          />
        </div>
      </footer>
    </main>
  );
}

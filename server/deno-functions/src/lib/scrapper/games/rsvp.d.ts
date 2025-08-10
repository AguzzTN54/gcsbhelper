export interface RSVPResponse {
  page: Page;
  pageSections: PageSection[];
  sectionColumns: SectionColumn[];
}

export interface Page {
  name: string;
  state: string;
  slug: string;
  creator: string;
  createTime: string;
  updater: string;
  updateTime: string;
  title: string;
  showNavigationLink: boolean;
  sortOrder: number;
  visible: boolean;
}

export interface PageSection {
  name: string;
  sortOrder?: number;
}

export interface SectionColumn {
  name: string;
  components: Component[];
  size: string;
  sortOrder?: number;
}

export interface Component {
  name: string;
  textComponent?: TextComponent;
  imageComponent?: ImageComponent;
  accordionComponent?: AccordionComponent;
}

export interface TextComponent {
  text: string;
  style?: string;
}

export interface ImageComponent {
  image: Image;
}

export interface Image {
  aspect: string;
  altText: string;
  fit: string;
  position: Position;
  size: number;
  uri: string;
  linkUri: string;
  linkTargetBlank: boolean;
}

export interface Position {
  x: number;
  y: number;
}

export interface AccordionComponent {
  items: Item[];
}

export interface Item {
  title: string;
  text: string;
  visible: boolean;
}


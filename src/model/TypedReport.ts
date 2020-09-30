export interface Input {
  url: string;
  pdf: boolean;
  callback: boolean;
  template: boolean;
}

export interface Overall {
  grade: string;
  title: string;
  description: string;
}

export interface Seo {
  grade: string;
  title: string;
  description: string;
}

export interface Performance {
  grade: string;
  title: string;
  description: string;
}

export interface Social {
  grade: string;
  title: string;
  description: string;
}

export interface Ui {
  grade: string;
  title: string;
  description: string;
}

export interface Security {
  grade: string;
  title: string;
  description: string;
}

export interface Scores {
  overall: Overall;
  seo: Seo;
  performance: Performance;
  social: Social;
  ui: Ui;
  security: Security;
}

export interface Title {
  section: string;
  passed: boolean;
  shortAnswer: string;
  recommendation?: any;
  value: string;
  data: string;
}

export interface Description {
  section: string;
  passed: boolean;
  shortAnswer: string;
  recommendation?: any;
  value: string;
  data: string;
}

export interface Data2 {
  h1: string[];
  h2: string[];
  h3: string[];
  h4: string[];
}

export interface Headers {
  section: string;
  passed: boolean;
  shortAnswer: string;
  recommendation?: any;
  data: Data2;
}

export interface Keyword {
  word: string;
  count: number;
  title: boolean;
  description: boolean;
  headers: boolean;
}

export interface Phras {
  word: string;
  count: number;
  title: boolean;
  description: boolean;
  headers: boolean;
  name: string;
  icon: string;
  website: string;
  version: string;
}

export interface Data3 {
  keywords: Keyword[];
  phrases: Phras[];
}

export interface Keywords {
  section: string;
  passed: boolean;
  shortAnswer: string;
  recommendation?: any;
  data: Data3;
}

export interface ContentLength {
  section: string;
  passed: boolean;
  shortAnswer: string;
  recommendation?: any;
  value: string;
}

export interface Data4 {
  total: number;
  altCount: number;
  noAltCount: number;
}

export interface ImageAlt {
  section: string;
  passed: boolean;
  shortAnswer: string;
  recommendation?: any;
  data: Data4;
}

export interface List {
  anchor_text: string;
  title: string;
  url: string;
  page_authority: number;
  domain_authority: number;
}

export interface Data5 {
  mozda: number;
  backlinks: number;
  list: List[];
}

export interface Backlinks {
  section: string;
  passed: boolean;
  shortAnswer: string;
  recommendation?: any;
  data: Data5;
}

export interface Data6 {
  total: number;
  filesCount: number;
  externalCount: number;
  nofollowCount: number;
  externalPercentage: number;
  nofollowPercentage: number;
}

export interface OnPageLinks {
  section: string;
  passed?: any;
  shortAnswer: string;
  recommendation?: any;
  data: Data6;
}

export interface BrokenLinks {
  section: string;
  passed: boolean;
  shortAnswer: string;
  recommendation?: any;
  data: any[];
}

export interface FriendlyUrls {
  section: string;
  passed: boolean;
  shortAnswer: string;
  recommendation?: any;
}

export interface NoindexTags {
  section: string;
  passed: boolean;
  shortAnswer: string;
  recommendation?: any;
  data?: any;
}

export interface NoindexHeaders {
  section: string;
  passed: boolean;
  shortAnswer: string;
  recommendation?: any;
  data?: any;
}

export interface RobotsTxt {
  section: string;
  passed: boolean;
  shortAnswer: string;
  recommendation?: any;
  data: string;
}

export interface Data7 {
  found: number;
  tested: number;
  urls: string[];
}

export interface Sitemap {
  section: string;
  passed: boolean;
  shortAnswer: string;
  recommendation?: any;
  data: Data7;
}

export interface Datum {
  id: string;
  name: string;
}

export interface Analytics {
  section: string;
  passed: boolean;
  shortAnswer: string;
  recommendation?: any;
  data: Datum[];
}

export interface SchemaOrg {
  section: string;
  passed: boolean;
  shortAnswer: string;
  recommendation?: any;
  data: string;
}

export interface Data8 {
  mobile: string;
  tablet: string;
}

export interface DeviceRendering {
  section: string;
  passed?: any;
  shortAnswer: string;
  recommendation?: any;
  data: Data8;
}

export interface MobileViewport {
  section: string;
  passed: boolean;
  shortAnswer: string;
  recommendation?: any;
}

export interface Flash {
  section: string;
  passed: boolean;
  shortAnswer: string;
  recommendation?: any;
}

export interface Iframe {
  section: string;
  passed: boolean;
  shortAnswer: string;
  recommendation?: any;
}

export interface Favicon {
  section: string;
  passed: boolean;
  shortAnswer: string;
  recommendation?: any;
}

export interface LegibleFonts {
  section: string;
  passed: boolean;
  shortAnswer: string;
  recommendation?: any;
}

export interface TapTargetSizing {
  section: string;
  passed: boolean;
  shortAnswer: string;
  recommendation?: any;
}

export interface Data9 {
  responseTime: number;
  loadTime: number;
  completeTime: number;
}

export interface ServerResponseTime {
  section: string;
  passed: boolean;
  shortAnswer: string;
  recommendation?: any;
  data: Data9;
}

export interface Data10 {
  totalSize: number;
  htmlSize: number;
  cssSize: number;
  jsSize: number;
  imageSize: number;
  otherSize: number;
}

export interface PageSize {
  section: string;
  passed: boolean;
  shortAnswer: string;
  recommendation: string;
  data: Data10;
}

export interface Data11 {
  total: number;
  images: number;
  css: number;
  js: number;
  html: number;
  other: number;
}

export interface NumberOfResources {
  section: string;
  passed?: any;
  shortAnswer: string;
  recommendation?: any;
  data: Data11;
}

export interface JavascriptErrors {
  section: string;
  passed: boolean;
  shortAnswer: string;
  recommendation?: any;
}

export interface Gzip {
  section: string;
  passed: boolean;
  shortAnswer: string;
  recommendation?: any;
  data: any[];
}

export interface OptimizedImages {
  section: string;
  passed: boolean;
  shortAnswer: string;
  recommendation: string;
}

export interface Minified {
  section: string;
  passed: boolean;
  shortAnswer: string;
  recommendation?: any;
}

export interface Deprecated {
  section: string;
  passed: boolean;
  shortAnswer: string;
  recommendation?: any;
}

export interface InlineCss {
  section: string;
  passed: boolean;
  shortAnswer: string;
  recommendation: string;
}

export interface FacebookLink {
  section: string;
  passed: boolean;
  shortAnswer: string;
  recommendation?: any;
}

export interface FacebookPixel {
  section: string;
  passed: boolean;
  shortAnswer: string;
  recommendation?: any;
  data?: any;
}

export interface TwitterLink {
  section: string;
  passed: boolean;
  shortAnswer: string;
  recommendation?: any;
}

export interface TwitterTags {
  section: string;
  passed: boolean;
  shortAnswer: string;
  recommendation?: any;
  data: any;
}

export interface Data13 {
  followers: number;
}

export interface TwitterActivity {
  section: string;
  passed: boolean;
  shortAnswer: string;
  recommendation?: any;
  data: Data13;
}

export interface InstagramLink {
  section: string;
  passed: boolean;
  shortAnswer: string;
  recommendation: string;
}

export interface YoutubeLink {
  section: string;
  passed: boolean;
  shortAnswer: string;
  recommendation: string;
}

export interface LinkedInLink {
  section: string;
  passed: boolean;
  shortAnswer: string;
  recommendation?: any;
  data?: any;
}

export interface OpenGraphTags {
  section: string;
  passed: boolean;
  shortAnswer: string;
  recommendation?: any;
}

export interface SslEnabled {
  section: string;
  passed: boolean;
  shortAnswer: string;
  recommendation?: any;
}

export interface HttpsRedirect {
  section: string;
  passed: boolean;
  shortAnswer: string;
  recommendation?: any;
}

export interface Data15 {
  google: string;
  mcafee: string;
  norton: string;
  avg: string;
}

export interface Malware {
  section: string;
  passed: boolean;
  shortAnswer: string;
  recommendation?: any;
  data: Data15;
}

export interface Email {
  section: string;
  passed: boolean;
  shortAnswer: string;
  recommendation?: any;
}

export interface Technologies {
  section: string;
  passed?: any;
  shortAnswer: string;
  recommendation?: any;
  data: string[];
}

export interface Ip {
  section: string;
  passed?: any;
  shortAnswer: string;
  recommendation?: any;
  data: string;
}

export interface Dns {
  section: string;
  passed?: any;
  shortAnswer: string;
  recommendation?: any;
  data: string;
}

export interface WebServer {
  section: string;
  passed?: any;
  shortAnswer: string;
  recommendation?: any;
  data: string;
}

export interface Charset {
  section: string;
  passed?: any;
  shortAnswer: string;
  recommendation?: any;
  data: string;
}

export interface List2 {
  anchor_text: string;
  title: string;
  url: string;
  page_authority: number;
  domain_authority: number;
}

export interface Data16 {
  allbacklinks: number;
  allbacklinks_root: number;
  mozda: number;
  mozda_root: number;
  backlinks: number;
  backlinks_root: number;
  list: List2[];
  response: string;
}

export interface BacklinksList {
  section: string;
  passed?: any;
  shortAnswer: string;
  recommendation?: any;
  data: Data16;
}

export interface Recommendation {
  priority: string;
  section: string;
  recommendation: string;
}

export interface Output {
  success: boolean;
  callback: boolean;
  pdf: string;
  recommendation_count: number;
  screenshot: string;
  report_generation_time: string;
  request_completion_time: string;
  scores: Scores;
  title: Title;
  description: Description;
  headers: Headers;
  keywords: Keywords;
  contentLength: ContentLength;
  imageAlt: ImageAlt;
  backlinks: Backlinks;
  onPageLinks: OnPageLinks;
  brokenLinks: BrokenLinks;
  friendlyUrls: FriendlyUrls;
  noindexTags: NoindexTags;
  noindexHeaders: NoindexHeaders;
  robotsTxt: RobotsTxt;
  sitemap: Sitemap;
  analytics: Analytics;
  schemaOrg: SchemaOrg;
  deviceRendering: DeviceRendering;
  mobileViewport: MobileViewport;
  flash: Flash;
  iframe: Iframe;
  favicon: Favicon;
  legibleFonts: LegibleFonts;
  tapTargetSizing: TapTargetSizing;
  serverResponseTime: ServerResponseTime;
  pageSize: PageSize;
  numberOfResources: NumberOfResources;
  javascriptErrors: JavascriptErrors;
  gzip: Gzip;
  optimizedImages: OptimizedImages;
  minified: Minified;
  deprecated: Deprecated;
  inlineCss: InlineCss;
  facebookLink: FacebookLink;
  facebookPixel: FacebookPixel;
  twitterLink: TwitterLink;
  twitterTags: TwitterTags;
  twitterActivity: TwitterActivity;
  instagramLink: InstagramLink;
  youtubeLink: YoutubeLink;
  youtubeActivity: boolean;
  linkedInLink: LinkedInLink;
  openGraphTags: OpenGraphTags;
  sslEnabled: SslEnabled;
  httpsRedirect: HttpsRedirect;
  malware: Malware;
  email: Email;
  technologies: Technologies;
  ip: Ip;
  dns: Dns;
  webServer: WebServer;
  charset: Charset;
  backlinksList: BacklinksList;
  recommendations: Recommendation[];
}

export interface Data {
  id: number;
  input: Input;
  output: Output;
  created_at: string;
  completed_at: string;
  hookedTime: string;
  generatedByUser: any;
  paidFor: boolean;
}

export interface RecentReport {
  id: number;
  score: number;
  timeAgo: Date;
  url: string;
  color1: string;
}

export interface TypedReport {
  success: boolean;
  data: Data;
}

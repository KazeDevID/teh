import { EventEmitter } from "events"
import type { ReadableStream, Stream } from "stream"

export interface BotOptions {
  polling?: boolean
  pollingInterval?: number
  pollingTimeout?: number
  webhook?: boolean
  webhookPort?: number
  webhookPath?: string
  requestTimeout?: number
  maxConnections?: number
  allowedUpdates?: string[]
  baseApiUrl?: string
}

export interface User {
  id: number
  is_bot: boolean
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
  is_premium?: boolean
  added_to_attachment_menu?: boolean
  can_join_groups?: boolean
  can_read_all_group_messages?: boolean
  supports_inline_queries?: boolean
  can_connect_to_business?: boolean
}

export interface Chat {
  id: number
  type: "private" | "group" | "supergroup" | "channel"
  title?: string
  username?: string
  first_name?: string
  last_name?: string
  is_forum?: boolean
  photo?: ChatPhoto
  bio?: string
  description?: string
  invite_link?: string
  pinned_message?: Message
  permissions?: ChatPermissions
  slow_mode_delay?: number
  message_auto_delete_time?: number
  has_protected_content?: boolean
  sticker_set_name?: string
  can_set_sticker_set?: boolean
  linked_chat_id?: number
  location?: ChatLocation
  is_topic?: boolean
}

export interface ChatPhoto {
  small_file_id: string
  small_file_unique_id: string
  big_file_id: string
  big_file_unique_id: string
}

export interface ChatPermissions {
  can_send_messages?: boolean
  can_send_audios?: boolean
  can_send_documents?: boolean
  can_send_photos?: boolean
  can_send_videos?: boolean
  can_send_video_notes?: boolean
  can_send_voice_notes?: boolean
  can_send_polls?: boolean
  can_send_other_messages?: boolean
  can_add_web_page_previews?: boolean
  can_change_info?: boolean
  can_invite_users?: boolean
  can_pin_messages?: boolean
  can_manage_topics?: boolean
}

export interface ChatLocation {
  location: Location
  address: string
}

export interface Message {
  message_id: number
  message_thread_id?: number
  from?: User
  sender_chat?: Chat
  sender_boost_count?: number
  date: number
  chat: Chat
  forward_from?: User
  forward_from_chat?: Chat
  forward_from_message_id?: number
  forward_signature?: string
  forward_sender_name?: string
  forward_date?: number
  is_topic_message?: boolean
  is_automatic_forward?: boolean
  reply_to_message?: Message
  external_reply_to_message?: ExternalReplyInfo
  quote?: TextQuote
  via_bot?: User
  edit_date?: number
  has_protected_content?: boolean
  media_group_id?: string
  author_signature?: string
  text?: string
  entities?: MessageEntity[]
  link_preview_options?: LinkPreviewOptions
  animation?: Animation
  audio?: Audio
  document?: Document
  photo?: PhotoSize[]
  sticker?: Sticker
  story?: Story
  video?: Video
  video_note?: VideoNote
  voice?: Voice
  caption?: string
  caption_entities?: MessageEntity[]
  has_media_spoiler?: boolean
  contact?: Contact
  dice?: Dice
  game?: Game
  poll?: Poll
  venue?: Venue
  location?: Location
  new_chat_members?: User[]
  left_chat_member?: User
  new_chat_title?: string
  new_chat_photo?: PhotoSize[]
  delete_chat_photo?: boolean
  group_chat_created?: boolean
  supergroup_chat_created?: boolean
  channel_chat_created?: boolean
  message_auto_delete_timer_changed?: MessageAutoDeleteTimerChanged
  migrate_to_chat_id?: number
  migrate_from_chat_id?: number
  pinned_message?: Message
  invoice?: Invoice
  successful_payment?: SuccessfulPayment
  users_shared?: UsersShared
  chat_shared?: ChatShared
  connected_website?: string
  write_access_allowed?: WriteAccessAllowed
  passport_data?: PassportData
  proximity_alert_triggered?: ProximityAlertTriggered
  forum_topic_created?: ForumTopicCreated
  forum_topic_edited?: ForumTopicEdited
  forum_topic_closed?: ForumTopicClosed
  forum_topic_reopened?: ForumTopicReopened
  general_forum_topic_hidden?: GeneralForumTopicHidden
  general_forum_topic_unhidden?: GeneralForumTopicUnhidden
  giveaway_created?: GiveawayCreated
  giveaway?: Giveaway
  giveaway_winners?: GiveawayWinners
  giveaway_completed?: GiveawayCompleted
  video_chat_scheduled?: VideoChatScheduled
  video_chat_started?: VideoChatStarted
  video_chat_ended?: VideoChatEnded
  video_chat_participants_invited?: VideoChatParticipantsInvited
  web_app_data?: WebAppData
  reply_markup?: InlineKeyboardMarkup
}

export interface MessageEntity {
  type: string
  offset: number
  length: number
  url?: string
  user?: User
  language?: string
  custom_emoji_id?: string
}

export interface TextQuote {
  text: string
  entities?: MessageEntity[]
  position: number
  is_manual?: boolean
}

export interface ExternalReplyInfo {
  origin: MessageOrigin
  chat?: Chat
  message_id?: number
  link_preview_options?: LinkPreviewOptions
  animation?: Animation
  audio?: Audio
  document?: Document
  photo?: PhotoSize[]
  sticker?: Sticker
  story?: Story
  video?: Video
  video_note?: VideoNote
  voice?: Voice
  has_media_spoiler?: boolean
  contact?: Contact
  dice?: Dice
  game?: Game
  giveaway?: Giveaway
  giveaway_winners?: GiveawayWinners
  invoice?: Invoice
  location?: Location
  poll?: Poll
  venue?: Venue
}

export interface MessageOrigin {
  type: string
  date: number
  user_id?: number
  sender_user_id?: number
  sender_user_name?: string
  sender_chat?: Chat
  author_signature?: string
  chat?: Chat
  message_id?: number
}

export interface LinkPreviewOptions {
  is_disabled?: boolean
  url?: string
  prefer_small_media?: boolean
  prefer_large_media?: boolean
  show_above_text?: boolean
}

export interface PhotoSize {
  file_id: string
  file_unique_id: string
  width: number
  height: number
  file_size?: number
}

export interface Audio {
  file_id: string
  file_unique_id: string
  duration: number
  performer?: string
  title?: string
  mime_type?: string
  file_size?: number
  thumb?: PhotoSize
}

export interface Document {
  file_id: string
  file_unique_id: string
  thumb?: PhotoSize
  file_name?: string
  mime_type?: string
  file_size?: number
}

export interface Video {
  file_id: string
  file_unique_id: string
  width: number
  height: number
  duration: number
  thumb?: PhotoSize
  mime_type?: string
  file_size?: number
}

export interface Animation {
  file_id: string
  file_unique_id: string
  width: number
  height: number
  duration: number
  thumb?: PhotoSize
  file_name?: string
  mime_type?: string
  file_size?: number
}

export interface Voice {
  file_id: string
  file_unique_id: string
  duration: number
  mime_type?: string
  file_size?: number
}

export interface VideoNote {
  file_id: string
  file_unique_id: string
  length: number
  duration: number
  thumb?: PhotoSize
  file_size?: number
}

export interface Sticker {
  file_id: string
  file_unique_id: string
  type: string
  width: number
  height: number
  is_animated: boolean
  is_video: boolean
  thumb?: PhotoSize
  emoji?: string
  set_name?: string
  premium_animation?: File
  mask_position?: MaskPosition
  custom_emoji_id?: string
  file_size?: number
}

export interface Story {
  forward_from_chat_id?: number
  forward_from_message_id?: number
}

export interface File {
  file_id: string
  file_unique_id: string
  file_size?: number
  file_path?: string
}

export interface MaskPosition {
  point: string
  x_shift: number
  y_shift: number
  scale: number
}

export interface Location {
  longitude: number
  latitude: number
  horizontal_accuracy?: number
  live_period?: number
  heading?: number
  proximity_alert_radius?: number
}

export interface Venue {
  location: Location
  title: string
  address: string
  foursquare_id?: string
  foursquare_type?: string
  google_place_id?: string
  google_place_type?: string
}

export interface Contact {
  phone_number: string
  first_name: string
  last_name?: string
  user_id?: number
  vcard?: string
}

export interface Dice {
  emoji: string
  value: number
}

export interface Game {
  title: string
  description: string
  photo: PhotoSize[]
  text?: string
  text_entities?: MessageEntity[]
  animation?: Animation
}

export interface Poll {
  id: string
  question: string
  question_entities?: MessageEntity[]
  options: PollOption[]
  total_voter_count: number
  is_closed: boolean
  is_anonymous: boolean
  type: string
  allows_multiple_answers: boolean
  explanation?: string
  explanation_entities?: MessageEntity[]
  open_period?: number
  close_date?: number
}

export interface PollOption {
  text: string
  text_entities?: MessageEntity[]
  voter_count: number
  is_chosen?: boolean
}

export interface PollAnswer {
  poll_id: string
  user: User
  option_ids: number[]
}

export interface Update {
  update_id: number
  message?: Message
  edited_message?: Message
  channel_post?: Message
  edited_channel_post?: Message
  message_reaction?: MessageReactionUpdated
  message_reaction_count?: MessageReactionCountUpdated
  inline_query?: InlineQuery
  chosen_inline_result?: ChosenInlineResult
  callback_query?: CallbackQuery
  shipping_query?: ShippingQuery
  pre_checkout_query?: PreCheckoutQuery
  poll?: Poll
  poll_answer?: PollAnswer
  my_chat_member?: ChatMemberUpdated
  chat_member?: ChatMemberUpdated
  chat_join_request?: ChatJoinRequest
  chat_boost?: ChatBoostUpdated
  removed_chat_boost?: ChatBoostRemoved
}

export interface MessageReactionUpdated {
  chat: Chat
  message_id: number
  user?: User
  actor_chat?: Chat
  date: number
  old_reaction: ReactionType[]
  new_reaction: ReactionType[]
}

export interface MessageReactionCountUpdated {
  chat: Chat
  message_id: number
  date: number
  reactions: ReactionCount[]
}

export interface ReactionType {
  type: string
  emoji?: string
  custom_emoji_id?: string
}

export interface ReactionCount {
  type: ReactionType
  total_count: number
  recent_donators?: User[]
}

export interface InlineQuery {
  id: string
  from: User
  query: string
  offset: string
  chat_type?: string
  location?: Location
}

export interface ChosenInlineResult {
  result_id: string
  from: User
  location?: Location
  inline_message_id?: string
  query: string
}

export interface CallbackQuery {
  id: string
  from: User
  message?: Message
  inline_message_id?: string
  chat_instance: string
  data?: string
  game_short_name?: string
}

export interface ShippingQuery {
  id: string
  from: User
  invoice_payload: string
  shipping_address: ShippingAddress
}

export interface ShippingAddress {
  country_code: string
  state: string
  city: string
  street_line1: string
  street_line2: string
  post_code: string
}

export interface PreCheckoutQuery {
  id: string
  from: User
  currency: string
  total_amount: number
  invoice_payload: string
  shipping_option_id?: string
  order_info?: OrderInfo
}

export interface OrderInfo {
  name?: string
  phone_number?: string
  email?: string
  shipping_address?: ShippingAddress
}

export interface ChatMemberUpdated {
  chat: Chat
  from: User
  date: number
  old_chat_member: ChatMember
  new_chat_member: ChatMember
  invite_link?: ChatInviteLink
  via_chat_folder_invite_link?: boolean
}

export interface ChatMember {
  user: User
  status: string
  custom_title?: string
  is_anonymous?: boolean
  can_be_edited?: boolean
  can_manage_chat?: boolean
  can_post_messages?: boolean
  can_edit_messages?: boolean
  can_delete_messages?: boolean
  can_manage_video_chats?: boolean
  can_restrict_members?: boolean
  can_promote_members?: boolean
  can_change_info?: boolean
  can_invite_users?: boolean
  can_pin_messages?: boolean
  can_manage_topics?: boolean
  is_member?: boolean
  can_send_messages?: boolean
  can_send_audios?: boolean
  can_send_documents?: boolean
  can_send_photos?: boolean
  can_send_videos?: boolean
  can_send_video_notes?: boolean
  can_send_voice_notes?: boolean
  can_send_polls?: boolean
  can_send_other_messages?: boolean
  can_add_web_page_previews?: boolean
  until_date?: number
}

export interface ChatInviteLink {
  invite_link: string
  creator: User
  creates_join_request: boolean
  is_primary: boolean
  is_revoked: boolean
  name?: string
  expire_date?: number
  member_limit?: number
  pending_join_request_count?: number
}

export interface ChatJoinRequest {
  chat: Chat
  from: User
  user_chat_id: number
  date: number
  bio?: string
  invite_link?: ChatInviteLink
}

export interface ChatBoostUpdated {
  chat: Chat
  boost: ChatBoost
}

export interface ChatBoost {
  boost_id: string
  user_id: number
  expiration_date: number
  start_date: number
}

export interface ChatBoostRemoved {
  chat: Chat
  boost_id: string
  remove_date: number
  source: ChatBoostSource
}

export interface ChatBoostSource {
  source: string
  user?: User
}

export interface VideoChatScheduled {
  start_date: number
}

export interface VideoChatStarted {}

export interface VideoChatEnded {
  duration: number
}

export interface VideoChatParticipantsInvited {
  users: User[]
}

export interface WebAppData {
  data: string
  button_text: string
}

export interface ProximityAlertTriggered {
  traveler: User
  watcher: User
  distance: number
}

export interface MessageAutoDeleteTimerChanged {
  message_auto_delete_time: number
}

export interface ForumTopicCreated {
  name: string
  icon_color: number
  icon_custom_emoji_id?: string
}

export interface ForumTopicEdited {
  name?: string
  icon_custom_emoji_id?: string
}

export interface ForumTopicClosed {}

export interface ForumTopicReopened {}

export interface GeneralForumTopicHidden {}

export interface GeneralForumTopicUnhidden {}

export interface GiveawayCreated {
  parameters?: GiveawayParameters
}

export interface Giveaway {
  chats: Chat[]
  winners_selection_date: number
  winner_count: number
  only_new_members?: boolean
  has_public_winners?: boolean
  prize_description?: string
  country_codes?: string[]
  premium_subscription_month_count?: number
}

export interface GiveawayWinners {
  chat: Chat
  giveaway_message_id: number
  winners_selection_date: number
  winner_count: number
  winners: User[]
  additional_chat_count?: number
  premium_subscription_month_count?: number
  unclaimed_prize_count?: number
  only_new_members?: boolean
  was_refunded?: boolean
  prize_description?: string
}

export interface GiveawayCompleted {
  winner_count: number
  unclaimed_prize_count?: number
  giveaway_message?: Message
}

export interface GiveawayParameters {
  boosted_chat_id: number
}

export interface UsersShared {
  request_id: number
  user_ids: number[]
}

export interface ChatShared {
  request_id: number
  chat_id: number
}

export interface WriteAccessAllowed {
  web_app_name?: string
}

export interface PassportData {
  data: EncryptedPassportElement[]
  credentials: EncryptedCredentials
}

export interface EncryptedPassportElement {
  type: string
  hash: string
  data?: string
  phone_number?: string
  email?: string
  files?: PassportFile[]
  front_side?: PassportFile
  reverse_side?: PassportFile
  selfie?: PassportFile
  translation?: PassportFile[]
}

export interface PassportFile {
  file_id: string
  file_unique_id: string
  file_size: number
  file_date: number
}

export interface EncryptedCredentials {
  data: string
  hash: string
  secret: string
}

export interface Invoice {
  title: string
  description: string
  start_parameter: string
  currency: string
  total_amount: number
}

export interface SuccessfulPayment {
  currency: string
  total_amount: number
  invoice_payload: string
  shipping_option_id?: string
  order_info?: OrderInfo
  telegram_payment_charge_id: string
  provider_payment_charge_id: string
}

export interface InlineKeyboardMarkup {
  inline_keyboard: InlineKeyboardButton[][]
}

export interface InlineKeyboardButton {
  text: string
  url?: string
  callback_data?: string
  web_app?: WebAppInfo
  login_url?: LoginUrl
  switch_inline_query?: string
  switch_inline_query_current_chat?: string
  switch_inline_query_chosen_chat?: SwitchInlineQueryChosenChat
  callback_game?: any
  pay?: boolean
}

export interface WebAppInfo {
  url: string
}

export interface LoginUrl {
  url: string
  forward_text?: string
  bot_username?: string
  request_write_access?: boolean
}

export interface SwitchInlineQueryChosenChat {
  allow_user_chats?: boolean
  allow_bot_chats?: boolean
  allow_group_chats?: boolean
  allow_channel_chats?: boolean
}

export interface ReplyKeyboardMarkup {
  keyboard: KeyboardButton[][]
  is_persistent?: boolean
  resize_keyboard?: boolean
  one_time_keyboard?: boolean
  input_field_placeholder?: string
  selective?: boolean
}

export interface KeyboardButton {
  text: string
  request_user?: KeyboardButtonRequestUser
  request_chat?: KeyboardButtonRequestChat
  request_contact?: boolean
  request_location?: boolean
  request_poll?: KeyboardButtonPollType
  request_location_access_denied?: boolean
  web_app?: WebAppInfo
}

export interface KeyboardButtonRequestUser {
  request_id: number
  user_is_bot?: boolean
  user_is_premium?: boolean
  max_quantity?: number
}

export interface KeyboardButtonRequestChat {
  request_id: number
  chat_is_channel: boolean
  chat_is_forum?: boolean
  chat_is_group_n_supergroup?: boolean
  chat_is_created?: boolean
  user_administrator_rights?: ChatAdministratorRights
  bot_administrator_rights?: ChatAdministratorRights
  bot_is_member?: boolean
  max_quantity?: number
}

export interface KeyboardButtonPollType {
  type?: string
}

export interface ChatAdministratorRights {
  is_anonymous?: boolean
  can_manage_chat?: boolean
  can_delete_messages?: boolean
  can_manage_video_chats?: boolean
  can_restrict_members?: boolean
  can_promote_members?: boolean
  can_change_info?: boolean
  can_invite_users?: boolean
  can_post_messages?: boolean
  can_edit_messages?: boolean
  can_pin_messages?: boolean
  can_manage_topics?: boolean
}

export interface ReplyKeyboardRemove {
  remove_keyboard: true
  selective?: boolean
}

export interface ForceReply {
  force_reply: true
  input_field_placeholder?: string
  selective?: boolean
}

export interface SendMessageOptions {
  parse_mode?: "Markdown" | "MarkdownV2" | "HTML"
  entities?: MessageEntity[]
  link_preview_options?: LinkPreviewOptions
  disable_notification?: boolean
  protect_content?: boolean
  reply_to_message_id?: number
  allow_sending_without_reply?: boolean
  reply_markup?: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply
  message_thread_id?: number
  business_connection_id?: string
}

export interface SendPhotoOptions extends SendMessageOptions {
  caption?: string
  caption_entities?: MessageEntity[]
  show_caption_above_media?: boolean
}

export interface SendDocumentOptions extends SendMessageOptions {
  caption?: string
  caption_entities?: MessageEntity[]
  disable_content_type_detection?: boolean
}

export interface SendMediaContent {
  text?: string
  image?: string | Buffer | ReadableStream
  video?: string | Buffer | ReadableStream
  audio?: string | Buffer | ReadableStream
  document?: string | Buffer | ReadableStream
  sticker?: string | Buffer | ReadableStream
  caption?: string
  [key: string]: any
}

export interface Context {
  update: Update
  bot: TelegramBot
  message?: Message
  callbackQuery?: CallbackQuery
  inlineQuery?: InlineQuery
  chosenInlineResult?: ChosenInlineResult
  poll?: Poll
  pollAnswer?: PollAnswer
  myChatMember?: ChatMemberUpdated
  chatMember?: ChatMemberUpdated
  chat?: Chat
  from?: User
  chatId?: number
  send: (content: string | SendMediaContent, options?: any) => Promise<Message>
  reply: (text: string, options?: any) => Promise<Message>
  replyWithPhoto: (photo: string | Buffer, options?: SendPhotoOptions) => Promise<Message>
  replyWithVideo: (video: string | Buffer, options?: any) => Promise<Message>
  replyWithAudio: (audio: string | Buffer, options?: any) => Promise<Message>
  replyWithDocument: (document: string | Buffer, options?: SendDocumentOptions) => Promise<Message>
  editMessageText: (text: string, options?: any) => Promise<Message | boolean>
  answerCallbackQuery: (options?: any) => Promise<boolean>
}

export type Middleware = (ctx: Context, next: () => Promise<void>) => Promise<void> | void
export type CommandHandler = (ctx: Context) => Promise<void> | void

export class InlineKeyboardBuilder {
  constructor()
  text(text: string, callbackData: string): this
  url(text: string, url: string): this
  login(text: string, loginUrl: any): this
  switchInline(text: string, query?: string): this
  switchInlineCurrent(text: string, query?: string): this
  game(text: string): this
  pay(text: string): this
  row(): this
  build(): InlineKeyboardMarkup
}

export class ReplyKeyboardBuilder {
  constructor()
  text(text: string): this
  requestContact(text: string): this
  requestLocation(text: string): this
  requestPoll(text: string, type?: string): this
  row(): this
  resize(resize?: boolean): this
  oneTime(oneTime?: boolean): this
  selective(selective?: boolean): this
  placeholder(text: string): this
  build(): ReplyKeyboardMarkup
}

export class TelegramBot extends EventEmitter {
  constructor(token: string, options?: BotOptions)

  request(method: string, params?: any, formData?: any): Promise<any>

  getMe(): Promise<User>
  getUpdates(params?: any): Promise<Update[]>
  setWebhook(url: string, params?: any): Promise<boolean>
  deleteWebhook(params?: any): Promise<boolean>
  getWebhookInfo(): Promise<any>

  sendMessage(chatId: number | string, content: string | SendMediaContent, options?: any): Promise<Message>
  sendPhoto(chatId: number | string, photo: string | Buffer, options?: SendPhotoOptions): Promise<Message>
  sendAudio(chatId: number | string, audio: string | Buffer, options?: any): Promise<Message>
  sendDocument(chatId: number | string, document: string | Buffer, options?: SendDocumentOptions): Promise<Message>
  sendVideo(chatId: number | string, video: string | Buffer, options?: any): Promise<Message>
  sendAnimation(chatId: number | string, animation: string | Buffer, options?: any): Promise<Message>
  sendVoice(chatId: number | string, voice: string | Buffer, options?: any): Promise<Message>
  sendVideoNote(chatId: number | string, videoNote: string | Buffer, options?: any): Promise<Message>
  sendSticker(chatId: number | string, sticker: string | Buffer, options?: any): Promise<Message>
  sendLocation(chatId: number | string, latitude: number, longitude: number, options?: any): Promise<Message>
  sendVenue(
    chatId: number | string,
    latitude: number,
    longitude: number,
    title: string,
    address: string,
    options?: any,
  ): Promise<Message>
  sendContact(chatId: number | string, phoneNumber: string, firstName: string, options?: any): Promise<Message>
  sendPoll(chatId: number | string, question: string, options: string[], params?: any): Promise<Message>
  sendDice(chatId: number | string, options?: any): Promise<Message>
  sendChatAction(chatId: number | string, action: string): Promise<boolean>

  forwardMessage(
    chatId: number | string,
    fromChatId: number | string,
    messageId: number,
    options?: any,
  ): Promise<Message>
  copyMessage(chatId: number | string, fromChatId: number | string, messageId: number, options?: any): Promise<any>

  editMessageText(text: string, options?: any): Promise<Message | boolean>
  editMessageCaption(options?: any): Promise<Message | boolean>
  editMessageReplyMarkup(options?: any): Promise<Message | boolean>
  deleteMessage(chatId: number | string, messageId: number): Promise<boolean>

  answerCallbackQuery(callbackQueryId: string, options?: any): Promise<boolean>
  answerInlineQuery(inlineQueryId: string, results: any[], options?: any): Promise<boolean>

  getChat(chatId: number | string): Promise<Chat>
  getChatAdministrators(chatId: number | string): Promise<ChatMember[]>
  getChatMemberCount(chatId: number | string): Promise<number>
  getChatMember(chatId: number | string, userId: number): Promise<ChatMember>

  setChatTitle(chatId: number | string, title: string): Promise<boolean>
  setChatDescription(chatId: number | string, description: string): Promise<boolean>

  pinChatMessage(chatId: number | string, messageId: number, options?: any): Promise<boolean>
  unpinChatMessage(chatId: number | string, options?: any): Promise<boolean>
  unpinAllChatMessages(chatId: number | string): Promise<boolean>

  leaveChat(chatId: number | string): Promise<boolean>
  banChatMember(chatId: number | string, userId: number, options?: any): Promise<boolean>
  unbanChatMember(chatId: number | string, userId: number, options?: any): Promise<boolean>
  restrictChatMember(chatId: number | string, userId: number, permissions: any, options?: any): Promise<boolean>
  promoteChatMember(chatId: number | string, userId: number, options?: any): Promise<boolean>

  getFile(fileId: string): Promise<any>
  downloadFile(fileId: string, destination: string): Promise<string>

  use(middleware: Middleware): this
  command(cmd: string | string[], handler: CommandHandler): this

  startPolling(): Promise<void>
  stopPolling(): void
  startWebhook(): Promise<void>
  stopWebhook(): void

  on(event: "update", listener: (update: Update) => void): this
  on(event: "message", listener: (message: Message, ctx: Context) => void): this
  on(event: "text", listener: (message: Message, ctx: Context) => void): this
  on(event: "photo", listener: (message: Message, ctx: Context) => void): this
  on(event: "document", listener: (message: Message, ctx: Context) => void): this
  on(event: "video", listener: (message: Message, ctx: Context) => void): this
  on(event: "audio", listener: (message: Message, ctx: Context) => void): this
  on(event: "voice", listener: (message: Message, ctx: Context) => void): this
  on(event: "sticker", listener: (message: Message, ctx: Context) => void): this
  on(event: "location", listener: (message: Message, ctx: Context) => void): this
  on(event: "contact", listener: (message: Message, ctx: Context) => void): this
  on(event: "edited_message", listener: (message: Message, ctx: Context) => void): this
  on(event: "channel_post", listener: (message: Message, ctx: Context) => void): this
  on(event: "edited_channel_post", listener: (message: Message, ctx: Context) => void): this
  on(event: "callback_query", listener: (query: CallbackQuery, ctx: Context) => void): this
  on(event: "inline_query", listener: (query: InlineQuery, ctx: Context) => void): this
  on(event: "chosen_inline_result", listener: (result: ChosenInlineResult, ctx: Context) => void): this
  on(event: "poll", listener: (poll: Poll, ctx: Context) => void): this
  on(event: "poll_answer", listener: (answer: PollAnswer, ctx: Context) => void): this
  on(event: "my_chat_member", listener: (member: ChatMemberUpdated, ctx: Context) => void): this
  on(event: "chat_member", listener: (member: ChatMemberUpdated, ctx: Context) => void): this
  on(event: "polling_start", listener: () => void): this
  on(event: "polling_stop", listener: () => void): this
  on(event: "polling_error", listener: (error: Error) => void): this
  on(event: "webhook_start", listener: (port: number) => void): this
  on(event: "webhook_stop", listener: () => void): this
  on(event: "webhook_error", listener: (error: Error) => void): this
  on(event: "error", listener: (error: Error) => void): this
  on(event: string, listener: (...args: any[]) => void): this

  // Payment Methods
  sendInvoice(
    chatId: number | string,
    title: string,
    description: string,
    payload: string,
    providerToken: string,
    currency: string,
    prices: any[],
    options?: any,
  ): Promise<Message>
  answerShippingQuery(shippingQueryId: string, ok: boolean, options?: any): Promise<boolean>
  answerPreCheckoutQuery(preCheckoutQueryId: string, ok: boolean, options?: any): Promise<boolean>

  // Games
  sendGame(chatId: number | string, gameShortName: string, options?: any): Promise<Message>
  setGameScore(userId: number, score: number, options?: any): Promise<Message | boolean>
  getGameHighScores(userId: number, options?: any): Promise<any[]>

  // Sticker Set Management
  createNewStickerSet(userId: number, name: string, title: string, stickerFormat: string, stickers: any[], options?: any): Promise<boolean>
  addStickerToSet(userId: number, name: string, sticker: any, options?: any): Promise<boolean>
  setStickerPositionInSet(sticker: string, position: number): Promise<boolean>
  deleteStickerFromSet(sticker: string): Promise<boolean>
  setStickerEmojiList(sticker: string, emojiList: string[]): Promise<boolean>
  setStickerKeywords(sticker: string, keywords?: string[]): Promise<boolean>
  setStickerMaskPosition(sticker: string, maskPosition?: any): Promise<boolean>
  getStickerSet(name: string): Promise<any>
  uploadStickerFile(userId: number, sticker: any, stickerFormat: string): Promise<any>
  replaceStickerInSet(userId: number, name: string, oldSticker: string, sticker: any): Promise<boolean>
  deleteStickerSet(name: string): Promise<boolean>
  setStickerSetThumbnail(name: string, userId: number, thumbnail?: any): Promise<boolean>
  setCustomEmojiStickerSetThumbnail(name: string, customEmojiId?: string): Promise<boolean>
  setStickerSetTitle(name: string, title: string): Promise<boolean>
  setStickerSetDescription(name: string, description: string): Promise<boolean>

  // Forum/Topic Management
  createForumTopic(chatId: number | string, name: string, options?: any): Promise<any>
  editForumTopic(chatId: number | string, messageThreadId: number, options?: any): Promise<boolean>
  closeForumTopic(chatId: number | string, messageThreadId: number): Promise<boolean>
  reopenForumTopic(chatId: number | string, messageThreadId: number): Promise<boolean>
  deleteForumTopic(chatId: number | string, messageThreadId: number): Promise<boolean>
  unpinAllForumTopicMessages(chatId: number | string, messageThreadId: number): Promise<boolean>
  editGeneralForumTopic(chatId: number | string, name: string): Promise<boolean>
  closeGeneralForumTopic(chatId: number | string): Promise<boolean>
  reopenGeneralForumTopic(chatId: number | string): Promise<boolean>
  hideGeneralForumTopic(chatId: number | string): Promise<boolean>
  unhideGeneralForumTopic(chatId: number | string): Promise<boolean>
  getForumTopicIconStickers(): Promise<any[]>

  // User Permissions & Rights Management
  setDefaultAdministratorRights(options?: any): Promise<boolean>
  getDefaultAdministratorRights(forChannels?: boolean): Promise<any>
  setDefaultChatMenuButton(options?: any): Promise<boolean>
  getDefaultChatMenuButton(): Promise<any>
  setChatMenuButton(chatId?: number | string | null, options?: any): Promise<boolean>
  getChatMenuButton(chatId?: number | string | null): Promise<any>

  // Chat Invite Links Management
  createChatInviteLink(chatId: number | string, options?: any): Promise<ChatInviteLink>
  editChatInviteLink(chatId: number | string, inviteLink: string, options?: any): Promise<ChatInviteLink>
  revokeChatInviteLink(chatId: number | string, inviteLink: string): Promise<ChatInviteLink>
  approveChatJoinRequest(chatId: number | string, userId: number): Promise<boolean>
  declineChatJoinRequest(chatId: number | string, userId: number): Promise<boolean>

  // Chat Boost Management
  getUserChatBoosts(chatId: number | string, userId: number): Promise<any>
  getAvailableGifts(): Promise<any[]>
  sendGift(userId: number, giftId: string, options?: any): Promise<boolean>

  // Message Reactions
  setMessageReaction(chatId: number | string, messageId: number, reaction?: any[], options?: any): Promise<boolean>
  getAvailableReactions(): Promise<any[]>

  // Media Group & Carousel
  sendMediaGroup(chatId: number | string, media: any[], options?: any): Promise<Message[]>

  // Scheduled Messages
  sendScheduledMessage(chatId: number | string, content: string | SendMediaContent, timestamp: number, options?: any): Promise<Message>
  getScheduledMessages(chatId: number | string): Promise<Message[]>
  deleteScheduledMessage(chatId: number | string, messageId: number): Promise<boolean>

  // User Profile Photos
  getUserProfilePhotos(userId: number, options?: any): Promise<any>
  setUserProfilePhoto(userId: number, photo: any, options?: any): Promise<boolean>
  deleteUserProfilePhoto(userId: number, photoId: string): Promise<boolean>

  // Commands Management
  setMyCommands(commands: any[], options?: any): Promise<boolean>
  deleteMyCommands(options?: any): Promise<boolean>
  getMyCommands(options?: any): Promise<any[]>
  setMyDefaultAdministratorRights(options?: any): Promise<boolean>
  getMyDefaultAdministratorRights(options?: any): Promise<any>

  // Webhook Management
  setWebhookCertificate(url: string, certificate: any, options?: any): Promise<boolean>
  setWebhookIpAddress(ipAddress: string): Promise<boolean>

  // Business Connections
  getBusinessConnection(businessConnectionId: string): Promise<any>

  // Web App Features
  sendWebAppData(webAppQueryId: string, data: string): Promise<boolean>

  // Commands Scoping
  setMyCommandsScope(commands: any[], scope: any, options?: any): Promise<boolean>
  getMyCommandsScope(scope: any): Promise<any[]>

  // Telegram Passport
  setPassportDataErrors(userId: number, errors: any[]): Promise<boolean>

  // Inline Query Result Helpers
  static InlineQueryResult: {
    article: (id: string, title: string, description: string, content: any) => any
    photo: (id: string, photoUrl: string, thumbUrl: string) => any
    gif: (id: string, gifUrl: string, thumbUrl: string) => any
    video: (id: string, videoUrl: string, mimeType: string, thumbUrl: string, title: string) => any
    audio: (id: string, audioUrl: string, title: string) => any
    voice: (id: string, voiceUrl: string, title: string) => any
    document: (id: string, documentUrl: string, title: string, mimeType: string) => any
  }

  // Rate Limiting & Retry Logic
  _executeWithRetry(method: string, params: any, maxRetries?: number): Promise<any>

  static InlineKeyboard(): InlineKeyboardBuilder
  static ReplyKeyboard(): ReplyKeyboardBuilder
  static RemoveKeyboard(): ReplyKeyboardRemove
  static ForceReply(): ForceReply
}


export default TelegramBot

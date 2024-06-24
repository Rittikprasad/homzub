import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { Attachment } from '@homzhub/common/src/domain/models/Attachment';

const mockMedia = [
  {
    id: 1,
    file_name: 'foobar.jpeg',
    media_type: 'IMAGE',
    link: 'https://hmzhbdev.s3.ap-south-1.amazonaws.com/asset_images/c1a1aac4-5108-11eb-8e84-0242ac110004IMG_0002.JPG',
    media_attributes: {},
  },
  {
    id: 2,
    file_name: 'foobar.jpeg',
    media_type: 'IMAGE',
    link: 'https://homzhub-bucket.s3.amazonaws.com/asset_images/8e8c48fc-c089-11ea-8247-34e12d38d70eprof.jpg',
    media_attributes: {},
  },
  {
    id: 3,
    file_name: 'foobar.jpeg',
    media_type: 'IMAGE',
    link: 'https://hmzhbdev.s3.ap-south-1.amazonaws.com/asset_images/c1a1aac4-5108-11eb-8e84-0242ac110004IMG_0002.JPG',
    media_attributes: {},
  },
  {
    id: 4,
    file_name: 'foobar.jpeg',
    media_type: 'IMAGE',
    link: 'https://homzhub-bucket.s3.amazonaws.com/asset_images/8e8c48fc-c089-11ea-8247-34e12d38d70eprof.jpg',
    media_attributes: {},
  },
];

export const mockChatMedia = ObjectMapper.deserializeArray(Attachment, mockMedia);

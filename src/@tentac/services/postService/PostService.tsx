import axios from "axios";
import path from "path-browserify";
import { IPost } from "../../types/auth/userTypes";
import AutoCRUD from "../../utils/AutoCRUD";
import { IAutoCrudOptions } from "../../utils/AutoCRUD.type";

export default class PostService extends AutoCRUD<IPost, number> {
  constructor() {
    const apiUrl: string = path.join(
      `${process.env.REACT_APP_API_BASE}`,
      "Posts"
    );
    super(apiUrl);
  }

  async likePost(postId: number, userId: string, options: IAutoCrudOptions) {
    try {
      const response = await axios
        .post(
          path.join(`${this.apiUrl}`, "like", `${postId}`),
          {
            userId,
          },
          {
            headers: {
              Authorization: `Bearer ${options?.bearerToken}`,
            },
          }
        )
        .then(async (data: any) => {
          await options?.success?.call(data, this);
          return data;
        })
        .catch(async (error) => {
          await options?.fail?.call(error, this);
          return error;
        })
        .finally(async () => await options?.finally?.call(this));

      return response.data;
    } catch (exception: any) {
      throw new Error(exception);
    }
  }

  async dislikePost(postId: number, userId: string, options: IAutoCrudOptions) {
    try {
      const response = await axios
        .post(
          path.join(`${this.apiUrl}`, "dislike", `${postId}`),
          {
            userId,
          },
          {
            headers: {
              Authorization: `Bearer ${options?.bearerToken}`,
            },
          }
        )
        .then(async (data: any) => {
          await options?.success?.call(data, this);
          return data;
        })
        .catch(async (error) => {
          await options?.fail?.call(error, this);
          return error;
        })
        .finally(async () => await options?.finally?.call(this));

      return response.data;
    } catch (exception: any) {
      throw new Error(exception);
    }
  }

  async likeReply(
    postId: number,
    replyId: number,
    userId: string,
    options: IAutoCrudOptions
  ) {
    try {
      const response = await axios
        .post(
          path.join(`${this.apiUrl}`, "likeReply", `${postId}`),
          {
            userId,
            replyId,
          },
          {
            headers: {
              Authorization: `Bearer ${options?.bearerToken}`,
            },
          }
        )
        .then(async (data: any) => {
          await options?.success?.call(data, this);
          return data;
        })
        .catch(async (error) => {
          await options?.fail?.call(error, this);
          return error;
        })
        .finally(async () => await options?.finally?.call(this));

      return response.data;
    } catch (exception: any) {
      throw new Error(exception);
    }
  }

  async dislikeReply(
    postId: number,
    replyId: number,
    userId: string,
    options: IAutoCrudOptions
  ) {
    try {
      const response = await axios
        .post(
          path.join(`${this.apiUrl}`, "dislikeReply", `${postId}`),
          {
            userId,
            replyId,
          },
          {
            headers: {
              Authorization: `Bearer ${options?.bearerToken}`,
            },
          }
        )
        .then(async (data: any) => {
          await options?.success?.call(data, this);
          return data;
        })
        .catch(async (error) => {
          await options?.fail?.call(error, this);
          return error;
        })
        .finally(async () => await options?.finally?.call(this));

      return response.data;
    } catch (exception: any) {
      throw new Error(exception);
    }
  }

  async replyPost(
    postId: number,
    userId: string,
    text: string,
    options: IAutoCrudOptions
  ) {
    try {
      const response = await axios
        .post(
          path.join(`${this.apiUrl}`, `${postId}`, "reply"),
          {
            userId: userId,
            Text: text,
          },
          {
            headers: {
              Authorization: `Bearer ${options?.bearerToken}`,
            },
          }
        )
        .then(async (data: any) => {
          await options?.success?.call(data, this);
          return data;
        })
        .catch(async (error) => {
          await options?.fail?.call(error, this);
          return error;
        })
        .finally(async () => await options?.finally?.call(this));

      return response.data;
    } catch (exception: any) {
      throw new Error(exception);
    }
  }

  async deleteReply(
    replyId: number,
    postId: number,
    options: IAutoCrudOptions
  ) {
    try {
      const response = await axios
        .post(
          path.join(`${this.apiUrl}`, `${postId}`, "deleteReply"),
          {
            replyId: replyId,
          },
          {
            headers: {
              Authorization: `Bearer ${options?.bearerToken}`,
            },
          }
        )
        .then(async (data: any) => {
          await options?.success?.call(data, this);
          return data;
        })
        .catch(async (error) => {
          await options?.fail?.call(error, this);
          return error;
        })
        .finally(async () => await options?.finally?.call(this));

      return response.data;
    } catch (exception: any) {
      throw new Error(exception);
    }
  }
}

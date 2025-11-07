import { randomUUID } from "crypto";
import type { LinkListTheme } from "@shared/schema";

interface StoredFile {
  id: string;
  buffer: Buffer;
  mimetype: string;
  originalName: string;
  createdAt: number;
}

interface StoredLinkList {
  id: string;
  theme: LinkListTheme;
  links: { label: string; url: string }[];
  createdAt: number;
}

interface IStorage {
  saveFile(data: Omit<StoredFile, "id" | "createdAt">): StoredFile;
  getFile(id: string): StoredFile | undefined;
  saveLinkList(data: Omit<StoredLinkList, "id" | "createdAt">): StoredLinkList;
  getLinkList(id: string): StoredLinkList | undefined;
}

const FILE_TTL_MS = 1000 * 60 * 60 * 24; // 24 hours
const LINK_LIST_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

export class MemStorage implements IStorage {
  private readonly files = new Map<string, StoredFile>();
  private readonly linkLists = new Map<string, StoredLinkList>();

  private cleanupFiles() {
    const now = Date.now();
    for (const [id, file] of this.files) {
      if (now - file.createdAt > FILE_TTL_MS) {
        this.files.delete(id);
      }
    }
  }

  private cleanupLinkLists() {
    const now = Date.now();
    for (const [id, list] of this.linkLists) {
      if (now - list.createdAt > LINK_LIST_TTL_MS) {
        this.linkLists.delete(id);
      }
    }
  }

  saveFile(data: Omit<StoredFile, "id" | "createdAt">): StoredFile {
    this.cleanupFiles();
    const record: StoredFile = {
      id: randomUUID(),
      createdAt: Date.now(),
      ...data,
    };
    this.files.set(record.id, record);
    return record;
  }

  getFile(id: string): StoredFile | undefined {
    const file = this.files.get(id);
    if (!file) return undefined;
    if (Date.now() - file.createdAt > FILE_TTL_MS) {
      this.files.delete(id);
      return undefined;
    }
    return file;
  }

  saveLinkList(data: Omit<StoredLinkList, "id" | "createdAt">): StoredLinkList {
    this.cleanupLinkLists();
    const record: StoredLinkList = {
      id: randomUUID(),
      createdAt: Date.now(),
      ...data,
    };
    this.linkLists.set(record.id, record);
    return record;
  }

  getLinkList(id: string): StoredLinkList | undefined {
    const list = this.linkLists.get(id);
    if (!list) return undefined;
    if (Date.now() - list.createdAt > LINK_LIST_TTL_MS) {
      this.linkLists.delete(id);
      return undefined;
    }
    return list;
  }
}

export const storage = new MemStorage();

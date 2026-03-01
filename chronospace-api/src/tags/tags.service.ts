import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTagDto } from './dto/create-tag.dto';

// Predefined palette — cycles through for auto-color assignment
const TAG_COLORS = [
  '#6366f1',
  '#8b5cf6',
  '#ec4899',
  '#f59e0b',
  '#10b981',
  '#06b6d4',
  '#ef4444',
  '#f97316',
  '#84cc16',
  '#a78bfa',
  '#14b8a6',
  '#f43f5e',
];

function generateSlug(label: string): string {
  return label
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s]+/g, '-')
    .replace(/-+/g, '-');
}

function pickColor(index: number): string {
  return TAG_COLORS[index % TAG_COLORS.length];
}

@Injectable()
export class TagsService {
  constructor(private readonly prisma: PrismaService) {}

  async createTag(dto: CreateTagDto) {
    const name = generateSlug(dto.label);

    // Check if slug already exists
    const existing = await this.prisma.tag.findUnique({ where: { name } });
    if (existing) {
      throw new ConflictException(
        `Tag "${dto.label}" already exists as "${existing.label}"`,
      );
    }

    // Pick color — either provided or auto-assigned from palette
    const totalTags = await this.prisma.tag.count();
    const color = dto.color ?? pickColor(totalTags);

    return this.prisma.tag.create({
      data: { name, label: dto.label.trim(), color },
      select: { id: true, name: true, label: true, color: true },
    });
  }

  async getAllTags() {
    return this.prisma.tag.findMany({
      orderBy: { label: 'asc' },
      select: { id: true, name: true, label: true, color: true },
    });
  }
}

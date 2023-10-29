import { Injectable } from '@nestjs/common';
import { FileTreeItem } from './rulesets.dto';
import { RULESETS_DIR } from 'src/constants';

@Injectable()
export class RulesetsService {
  retrievePath(treeItem: FileTreeItem): FileTreeItem {
    const { name, path } = treeItem;
    const _retrieve = (input: string) => {
      return input.replace(new RegExp(`${RULESETS_DIR}/?`), '');
    };
    return {
      ...treeItem,
      name: _retrieve(name),
      path: _retrieve(path),
    };
  }
}

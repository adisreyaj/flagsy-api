import { FastifyRequest } from 'fastify';
import { RouteGenericInterface } from 'fastify/types/route';
import { isEmpty, isNil } from 'lodash';
import queryString from 'query-string-esm';
import { SortOrder } from '../types/common.type';

export abstract class QueryParamParseUtil {
  static parse<
    RouteInterface extends RouteGenericInterface = RouteGenericInterface,
  >(
    query?: FastifyRequest<RouteInterface>['query'],
    opts?: QueryParamParseUtilOptions,
  ): QueryParamsParsed {
    const { sortBy, direction, offset, limit, filter, search } = (query ??
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {}) as any;

    const parsed: QueryParamsParsed = {
      filters: {},
      pagination: {
        offset: 0,
        limit: 1000,
      },
    };

    if (!isEmpty(sortBy)) {
      parsed.sort = {
        sortBy: !isNil(opts?.sortKeyTransform)
          ? opts!.sortKeyTransform(sortBy)
          : sortBy,
        direction: direction ?? ('desc' as SortOrder),
      };
    }

    if (!isNil(offset) || !isNil(limit)) {
      parsed.pagination = {
        offset: offset ?? 0,
        limit: limit ?? opts?.defaultLimit ?? 1000,
      };
    }

    if (!isEmpty(search?.trim())) {
      parsed.search = search.trim();
    }

    if (!isEmpty(filter)) {
      const qsParsed = queryString.parse(filter ?? '', {
        arrayFormat: 'separator',
        arrayFormatSeparator: ':',
        decode: true,
      });
      parsed.filters = Object.entries(qsParsed).reduce((acc, [key, value]) => {
        return {
          ...acc,
          [key]: !isNil(value) ? (Array.isArray(value) ? value : [value]) : [],
        };
      }, {});
    }

    return parsed;
  }
}

export interface QueryParamsParsed {
  sort?: {
    sortBy: string;
    direction: SortOrder;
  };
  pagination: {
    offset: number;
    limit: number;
  };
  search?: string;
  filters: Record<string, string[]>;
}

export interface QueryParamParseUtilOptions {
  sortKeyTransform?: (key: string) => string;
  defaultLimit?: number;
}

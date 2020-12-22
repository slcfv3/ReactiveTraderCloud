import { watch$ } from "services/client"
import { Observable, ReplaySubject, merge, timer } from "rxjs"
import { bind } from "@react-rxjs/core"
import {
  multicast,
  refCount,
  map,
  groupBy,
  mergeMap,
  scan,
  switchMap,
  mapTo,
  distinctUntilChanged,
} from "rxjs/operators"
import {
  ServiceInstanceStatus,
  ServiceInstanceCollection,
  ServiceCollectionMap,
} from "./serviceInstanceCollection"

export interface RawServiceStatus {
  Type: string
  Instance: string
  TimeStamp: number
  Load: number
}

const HEARTBEAT_TIMEOUT = 3000
const statusUpdates$ = watch$<RawServiceStatus>("status")

export const debounceWithSelector = <T>(
  dueTime: number,
  itemSelector: (lastValue: T) => T,
): ((source: Observable<T>) => Observable<T>) => {
  return (source$) => {
    const timeout$ = source$.pipe(
      switchMap((last) => timer(dueTime).pipe(mapTo(itemSelector(last)))),
    )

    return merge(source$, timeout$)
  }
}

const createServiceInstanceForDisconnected = (
  serviceType: string,
  serviceId: string,
): ServiceInstanceStatus => {
  return {
    serviceType,
    serviceId,
    timestamp: NaN,
    serviceLoad: NaN,
    isConnected: false,
  }
}

const addHeartBeatToServiceInstanceStatus = (
  heartBeatTimeout: number,
): ((
  source: Observable<ServiceInstanceStatus>,
) => Observable<ServiceInstanceStatus>) => {
  return (source$) =>
    source$.pipe(
      groupBy((serviceStatus) => serviceStatus.serviceId),
      mergeMap((service$) =>
        service$.pipe(
          debounceWithSelector<ServiceInstanceStatus>(
            heartBeatTimeout,
            (lastValue) =>
              createServiceInstanceForDisconnected(
                lastValue.serviceType,
                lastValue.serviceId,
              ),
          ),
          distinctUntilChanged<ServiceInstanceStatus>(
            (status, statusNew) =>
              status.isConnected === statusNew.isConnected &&
              status.serviceLoad === statusNew.serviceLoad,
          ),
        ),
      ),
    )
}

export const serviceStatusStream$ = (
  statusUpdate$: Observable<RawServiceStatus>,
  heartBeatTimeout: number,
) => {
  return statusUpdate$.pipe(
    map(convertFromRawMessage),
    groupBy((serviceInstanceStatus) => serviceInstanceStatus.serviceType),
    mergeMap((serviceInstanceStatus) =>
      serviceInstanceStatus.pipe(
        addHeartBeatToServiceInstanceStatus(heartBeatTimeout),
        scan<ServiceInstanceStatus, ServiceInstanceCollection>(
          (serviceInstanceCollection, next) =>
            serviceInstanceCollection.update(next),
          new ServiceInstanceCollection(serviceInstanceStatus.key),
        ),
      ),
    ),
    scan<ServiceInstanceCollection, ServiceCollectionMap>(
      (serviceCollectionMap, serviceInstanceCollection) => {
        return serviceCollectionMap.add(
          serviceInstanceCollection.serviceType,
          serviceInstanceCollection,
        )
      },
      new ServiceCollectionMap(),
    ),
  )
}

const convertFromRawMessage = (
  serviceStatus: RawServiceStatus,
): ServiceInstanceStatus => {
  return {
    serviceType: serviceStatus.Type,
    serviceId: serviceStatus.Instance,
    timestamp: serviceStatus.TimeStamp,
    serviceLoad: serviceStatus.Load,
    isConnected: true,
  }
}

export const [useServiceStatus, serviceStatus$] = bind(
  serviceStatusStream$(statusUpdates$, HEARTBEAT_TIMEOUT).pipe(
    multicast(() => {
      return new ReplaySubject<ServiceCollectionMap>(1)
    }),
    refCount(),
    map((serviceMap) => Object.values(serviceMap.getStatusOfServices())),
  ),
)

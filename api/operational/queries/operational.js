//operationals table
module.exports.table = (data) => {
return `SELECT t1.store_id,
substring(t1.store_date, 1, 10) AS store_date,
substring(opening_time, 1, 5) AS opening_time,
substring(closing_time, 1, 5) AS closing_time,
substring(operating_time, 1, 5) AS operating_time,
infra_down_time_minutes
FROM(
(SELECT store_id,
        store_date,
        opening_time,
        closing_time,
        operating_time
 FROM store_operation_metrics
 WHERE store_date BETWEEN '${data.fromDate}' AND '${data.toDate}'
   AND store_id in ('${data.storeId}')
   AND composite_inserted_at in
     (SELECT max(composite_inserted_at)
      FROM store_operation_metrics
      WHERE store_date BETWEEN '${data.fromDate}' AND '${data.toDate}'
        AND store_id in ('${data.storeId}')
      GROUP BY store_date,
               store_id)) AS t1
INNER JOIN
(SELECT store_id,
        store_date,
        sum(downtime) AS infra_down_time_minutes
 FROM camera_operation_metrics
 WHERE store_date BETWEEN '${data.fromDate}' AND '${data.toDate}'
   AND store_id in ('${data.storeId}')
 GROUP BY store_id,
          store_date) AS t2 ON t1.store_date=t2.store_date)
ORDER BY store_date
${data.limit_query}`.normalize();

}

//operationals table count
module.exports.table_count = (data) => {
  return `SELECT count(*) AS total_records_count
  FROM
    (SELECT t1.store_id,
            substring(t1.store_date, 1, 10) AS store_date,
            substring(opening_time, 1, 5) AS opening_time,
            substring(closing_time, 1, 5) AS closing_time,
            substring(operating_time, 1, 5) AS operating_time,
            infra_down_time_minutes
     FROM(
            (SELECT store_id,
                    store_date,
                    opening_time,
                    closing_time,
                    operating_time
             FROM store_operation_metrics
             WHERE store_date BETWEEN '${data.fromDate}' AND '${data.toDate}'
               AND store_id in ('${data.storeId}')
               AND composite_inserted_at in
                 (SELECT max(composite_inserted_at)
                  FROM store_operation_metrics
                  WHERE store_date BETWEEN '${data.fromDate}' AND '${data.toDate}'
                    AND store_id in ('${data.storeId}')
                  GROUP BY store_date,
                           store_id)) AS t1
          INNER JOIN
            (SELECT store_id,
                    store_date,
                    sum(downtime) AS infra_down_time_minutes
             FROM camera_operation_metrics
             WHERE store_date BETWEEN '${data.fromDate}' AND '${data.toDate}'
               AND store_id in ('${data.storeId}')
             GROUP BY store_id,
                      store_date) AS t2 ON t1.store_date=t2.store_date))`.normalize();
  
  }

// infra down time graph --hourly
module.exports.cameraDownTimeHourly = (data) => {
  return `SELECT substring(store_date, 1, 10) AS store_date,
  store_id,
  split_part(downtime_hour_range, '-', 1) AS HOUR,
  downtime_hour_range,
  sum(downtime) AS camera_down_time_minutes
FROM camera_operation_metrics
WHERE store_date BETWEEN '${data.fromDate}' AND '${data.toDate}'
AND store_id in ('${data.storeId}')
GROUP BY store_date,
    store_id,
    HOUR,
    downtime_hour_range`.normalize();
}

// infra down time graph --daily
module.exports.cameraDownTimeDaily = (data) => {
  return `SELECT store_id,
  SUBSTRING(store_date,1,10) as store_date ,
  sum(downtime) AS camera_down_time_minutes
FROM camera_operation_metrics
WHERE store_date BETWEEN '${data.fromDate}' AND '${data.toDate}'
AND store_id in ('${data.storeId}')
GROUP BY store_id,
    store_date
ORDER BY store_date`.normalize()
}

// infra down time graph --weekly
module.exports.cameraDownTimeWeekly = (data) =>{
  return `SELECT store_id,
  extract(YEAR
          FROM store_date) || '-' || extract(WEEK
                                             FROM store_date) AS WEEK,
  substring(min(store_date), 1, 10) AS store_date,
  sum(downtime) AS camera_down_time_minutes
FROM camera_operation_metrics
WHERE store_date BETWEEN '${data.fromDate}' AND '${data.toDate}'
AND store_id in ('${data.storeId}')
GROUP BY store_id,
    WEEK
ORDER BY WEEK`.normalize();

}
// infra down time graph --monthly
module.exports.cameraDownTimeMonthly = (data) =>{
  return `SELECT store_id,
  substring(store_date, 1, 7) AS MONTH,
  substring(min(store_date), 1, 10) AS store_date,
  sum(downtime) AS camera_down_time_minutes
FROM camera_operation_metrics
WHERE store_date BETWEEN '${data.fromDate}' AND '${data.toDate}'
AND store_id in ('${data.storeId}')
GROUP BY store_id,
    MONTH
ORDER BY MONTH`.normalize();

}
// opening time, closing time and operating time graph --Daily
module.exports.dailyData = (data) => {
return `SELECT store_id,
substring(store_date, 1, 10) AS store_date,
substring(opening_time, 1, 5) AS opening_time,
substring(closing_time, 1, 5) AS closing_time,
substring(operating_time, 1, 5) AS operating_time
FROM store_operation_metrics
WHERE store_date BETWEEN '${data.fromDate}' AND '${data.toDate}'
AND store_id in ('${data.storeId}')
AND composite_inserted_at in
(SELECT max(composite_inserted_at)
FROM store_operation_metrics
WHERE store_date BETWEEN '${data.fromDate}' AND '${data.toDate}'
AND store_id in ('${data.storeId}')
GROUP BY store_date,
       store_id)
ORDER BY store_date`.normalize();
}

// opening time, closing time and operating time graph --weekly
module.exports.weeklyData = (data) => {
 
return `SELECT store_id,
WEEK,
substring(week_starting_date, 1, 10) AS store_date,
substring(TIMESTAMP 'epoch' + avg_opening_time * INTERVAL '1 Second ', 12, 5) AS opening_time,
substring(TIMESTAMP 'epoch' + avg_closing_time * INTERVAL '1 Second ', 12, 5) AS closing_time,
substring(TIMESTAMP 'epoch' + avg_operating_time * INTERVAL '1 Second ', 12, 5) AS operating_time
FROM
(SELECT store_id,
   substring(min(store_date), 1, 10) AS week_starting_date,
   extract(YEAR
           FROM store_date) || '-' || extract(WEEK
                                              FROM store_date) AS WEEK,
   avg(open_hour*3600+open_minute*60+open_second) AS avg_opening_time,
   avg(close_hour*3600+close_minute*60+close_second) AS avg_closing_time,
   avg(operate_hour*3600+operate_minute*60+operate_second) AS avg_operating_time
FROM
(SELECT store_id,
      store_date,
      cast(substring(opening_time, 1, 2) AS integer) AS open_hour,
      cast(substring(opening_time, 4, 2) AS integer) AS open_minute,
      cast(substring(opening_time, 7, 2) AS integer) AS open_second,
      cast(substring(closing_time, 1, 2) AS integer) AS close_hour,
      cast(substring(closing_time, 4, 2) AS integer) AS close_minute,
      cast(substring(closing_time, 7, 2) AS integer) AS close_second,
      cast(substring(operating_time, 1, 2) AS integer) AS operate_hour,
      cast(substring(operating_time, 4, 2) AS integer) AS operate_minute,
      cast(substring(operating_time, 7, 2) AS integer) AS operate_second
FROM store_operation_metrics
WHERE store_date BETWEEN '${data.fromDate}' AND '${data.toDate}'
 AND store_id in ('${data.storeId}')
 AND composite_inserted_at in
   (SELECT max(composite_inserted_at)
    FROM store_operation_metrics
    WHERE store_date BETWEEN '${data.fromDate}' AND '${data.toDate}'
      AND store_id in ('${data.storeId}')
    GROUP BY store_id,
             store_date))
GROUP BY store_id,
     WEEK)
ORDER BY WEEK`.normalize();

}

// opening time, closing time and operating time graph --Monthly
module.exports.monthlyData = (data) => {

return `SELECT store_id,
MONTH,
substring(month_starting_date, 1, 10) AS store_date,
substring(TIMESTAMP 'epoch' + avg_opening_time * INTERVAL '1 Second ', 12, 5) AS opening_time,
substring(TIMESTAMP 'epoch' + avg_closing_time * INTERVAL '1 Second ', 12, 5) AS closing_time,
substring(TIMESTAMP 'epoch' + avg_operating_time * INTERVAL '1 Second ', 12, 5) AS operating_time
FROM
(SELECT store_id,
   substring(min(store_date), 1, 10) AS month_starting_date,
   substring(store_date, 1, 7) AS MONTH,
   avg(open_hour*3600+open_minute*60+open_second) AS avg_opening_time,
   avg(close_hour*3600+close_minute*60+close_second) AS avg_closing_time,
   avg(operate_hour*3600+operate_minute*60+operate_second) AS avg_operating_time
FROM
(SELECT store_id,
      store_date,
      cast(substring(opening_time, 1, 2) AS integer) AS open_hour,
      cast(substring(opening_time, 4, 2) AS integer) AS open_minute,
      cast(substring(opening_time, 7, 2) AS integer) AS open_second,
      cast(substring(closing_time, 1, 2) AS integer) AS close_hour,
      cast(substring(closing_time, 4, 2) AS integer) AS close_minute,
      cast(substring(closing_time, 7, 2) AS integer) AS close_second,
      cast(substring(operating_time, 1, 2) AS integer) AS operate_hour,
      cast(substring(operating_time, 4, 2) AS integer) AS operate_minute,
      cast(substring(operating_time, 7, 2) AS integer) AS operate_second
FROM store_operation_metrics
WHERE store_date BETWEEN '${data.fromDate}' AND '${data.toDate}'
 AND store_id in ('${data.storeId}')
 AND composite_inserted_at in
   (SELECT max(composite_inserted_at)
    FROM store_operation_metrics
    WHERE store_date BETWEEN '${data.fromDate}' AND '${data.toDate}'
      AND store_id in ('${data.storeId}')
    GROUP BY store_id,
             store_date))
GROUP BY store_id,
     MONTH)
ORDER BY MONTH`.normalize()

}

// open and closing time --single selected date
module.exports.singleDate = (data) => {
return `SELECT store_id,
substring(store_date, 1, 10) AS store_date,
substring(opening_time, 1, 5) AS opening_time,
substring(closing_time, 1, 5) AS closing_time
FROM store_operation_metrics
WHERE store_date BETWEEN '${data.previous}' AND '${data.toDate}'
AND store_id in ('${data.storeId}')
AND composite_inserted_at in
(SELECT max(composite_inserted_at)
FROM store_operation_metrics
WHERE store_date BETWEEN '${data.previous}' AND '${data.toDate}'
AND store_id in ('${data.storeId}')
GROUP BY store_date,
       store_id)`.normalize();
}

// open and closing time --multiple selected date
module.exports.multipleDate = (data) => {
return `SELECT store_id,
substring(TIMESTAMP 'epoch' + avg_opening_time * INTERVAL '1 Second ', 12, 5) AS opening_time,
substring(TIMESTAMP 'epoch' + avg_closing_time * INTERVAL '1 Second ', 12, 5) AS closing_time
FROM
(SELECT store_id,
   avg(open_hour*3600+open_minute*60+open_second) AS avg_opening_time,
   avg(close_hour*3600+close_minute*60+close_second) AS avg_closing_time
FROM
(SELECT store_id,
      cast(substring(opening_time, 1, 2) AS integer) AS open_hour,
      cast(substring(opening_time, 4, 2) AS integer) AS open_minute,
      cast(substring(opening_time, 7, 2) AS integer) AS open_second,
      cast(substring(closing_time, 1, 2) AS integer) AS close_hour,
      cast(substring(closing_time, 4, 2) AS integer) AS close_minute,
      cast(substring(closing_time, 7, 2) AS integer) AS close_second
FROM store_operation_metrics
WHERE store_date BETWEEN '${data.fromDate}' AND '${data.toDate}'
 AND store_id in ('${data.storeId}')
 AND composite_inserted_at in
   (SELECT max(composite_inserted_at)
    FROM store_operation_metrics
    WHERE store_date BETWEEN '${data.fromDate}' AND '${data.toDate}'
      AND store_id in ('${data.storeId}')
    GROUP BY store_date,
             store_id))
GROUP BY store_id)`.normalize();

}

// operational overview -- single date selected
module.exports.singleOverView = (data) => {
return `SELECT store_id,
substring(store_date, 1, 10) AS store_date,
substring(operating_time, 1, 5) AS operating_time
FROM store_operation_metrics
WHERE store_date BETWEEN '${data.fromDate}' AND '${data.toDate}'
AND store_id in ('${data.storeId}')
AND composite_inserted_at in
(SELECT max(composite_inserted_at)
FROM store_operation_metrics
WHERE store_date BETWEEN '${data.fromDate}' AND '${data.toDate}'
AND store_id in ('${data.storeId}')
GROUP BY store_date,
       store_id)
ORDER BY store_date`.normalize();
}

// operational overview -- multiple date selected
module.exports.multiOverView = (data) => {
return `SELECT store_id,
((cast(substring(total_operating_time, 9, 2) AS integer)-01)*24+cast(substring(total_operating_time, 12, 2) AS integer))||substring(total_operating_time, 14, 3) AS operating_time,
avg_operating_hours
FROM
(SELECT store_id,
   substring(TIMESTAMP 'epoch' + avg_value * INTERVAL '1 Second ', 12, 5) AS avg_operating_hours,
   TIMESTAMP 'epoch' + sum_value * INTERVAL '1 Second ' AS total_operating_time
FROM
(SELECT store_id,
      avg(HOUR*3600+MINUTE*60+SECOND) AS avg_value,
      sum(HOUR*3600+MINUTE*60+SECOND) AS sum_value
FROM
 (SELECT store_id,
         cast(substring(operating_time, 1, 2) AS integer) AS HOUR,
         cast(substring(operating_time, 4, 2) AS integer) AS MINUTE,
         cast(substring(operating_time, 7, 2) AS integer) AS SECOND
  FROM store_operation_metrics
  WHERE store_date BETWEEN '${data.fromDate}' AND '${data.toDate}'
    AND store_id in ('${data.storeId}')
    AND composite_inserted_at in
      (SELECT max(composite_inserted_at)
       FROM store_operation_metrics
       WHERE store_date BETWEEN '${data.fromDate}' AND '${data.toDate}'
         AND store_id in ('${data.storeId}')
       GROUP BY store_date,
                store_id))
GROUP BY store_id))`.normalize();

}

// operational overview graph -- multiple date selected
module.exports.operGraph = (data) => {
  return `SELECT store_id,
  SUBSTRING(store_date, 1, 10) AS store_date,
  operating_time
FROM store_operation_metrics
WHERE store_date BETWEEN '${data.fromDate}' AND '${data.toDate}'
AND store_id in ('${data.storeId}')
AND composite_inserted_at in
(SELECT max(composite_inserted_at)
FROM store_operation_metrics
WHERE store_date BETWEEN '${data.fromDate}' AND '${data.toDate}'
  AND store_id in ('${data.storeId}')
GROUP BY store_date,
         store_id)
ORDER BY store_date`.normalize();
}

// average open close operating hours
module.exports.avgOpenCloseOper = (data) => {
  return `SELECT store_id,
  substring(TIMESTAMP 'epoch' + avg_opening_time * INTERVAL '1 Second ', 12, 5) AS avg_opening_time,
  substring(TIMESTAMP 'epoch' + avg_closing_time * INTERVAL '1 Second ', 12, 5) AS avg_closing_time,
  substring(TIMESTAMP 'epoch' + avg_value * INTERVAL '1 Second ', 12, 5) AS avg_operating_hours
FROM
(SELECT store_id,
     avg(open_hour*3600+open_minute*60+open_second) AS avg_opening_time,
     avg(close_hour*3600+close_minute*60+close_second) AS avg_closing_time,
     avg(HOUR*3600+MINUTE*60+SECOND) AS avg_value
FROM
(SELECT store_id,
        cast(substring(opening_time, 1, 2) AS integer) AS open_hour,
        cast(substring(opening_time, 4, 2) AS integer) AS open_minute,
        cast(substring(opening_time, 7, 2) AS integer) AS open_second,
        cast(substring(closing_time, 1, 2) AS integer) AS close_hour,
        cast(substring(closing_time, 4, 2) AS integer) AS close_minute,
        cast(substring(closing_time, 7, 2) AS integer) AS close_second,
cast(substring(operating_time, 1, 2) AS integer) AS HOUR,
           cast(substring(operating_time, 4, 2) AS integer) AS MINUTE,
           cast(substring(operating_time, 7, 2) AS integer) AS SECOND
 FROM store_operation_metrics
 WHERE store_date BETWEEN '${data.fromDate}' AND '${data.toDate}'
   AND store_id in ('${data.storeId}')
   AND composite_inserted_at in
     (SELECT max(composite_inserted_at)
      FROM store_operation_metrics
      WHERE store_date BETWEEN '${data.fromDate}' AND '${data.toDate}'
        AND store_id in ('${data.storeId}')
      GROUP BY store_date,
               store_id))
GROUP BY store_id)`.normalize();
}

// avg infra down time
module.exports.avgInfraDown =(data) => {
  return `SELECT store_id,
  avg(infra_down_time_minutes) AS avg_camera_down_time_minutes
FROM
(SELECT store_id,
     store_date,
     sum(downtime) AS infra_down_time_minutes
FROM camera_operation_metrics
WHERE store_date BETWEEN '${data.fromDate}' AND '${data.toDate}'
AND store_id in ('${data.storeId}')
GROUP BY store_id,
       store_date)
GROUP BY store_id`.normalize();
}



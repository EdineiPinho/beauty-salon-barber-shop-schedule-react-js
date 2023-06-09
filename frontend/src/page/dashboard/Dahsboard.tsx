import style from './Dashboard.module.css'
import Header from '../../components/Header/Header.tsx'
import { useAuth } from '../../hooks/auth.ts'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import Card from '../../components/Card/Card.tsx'
import { useEffect, useState } from 'react'
import ptBR from 'date-fns/locale/pt-BR'
import { format, isToday } from 'date-fns'
import { api } from '../../server/Server.tsx'

interface ISchedule {
  name: string
  phone: string
  date: Date
  id: string
}

export function Dashboard() {
  const [date, setDate] = useState(new Date())
  const [schedules, setSchedules] = useState<Array<ISchedule>>([])
  const { user } = useAuth()

  const isWeekDay = (date: Date) => {
    const day = date.getDay()
    return day !== 0 && day !== 6
  }

  const isWeekend = (date: Date) => {
    const day = date.getDay()
    return day === 0 || day === 6
  }

  const handleDateChange = (date: Date) => {
    setDate(date)
  }

  useEffect(() => {
    api.get('/schedules', {
      params: {
        date,
      }
    }).then((response) => {
      console.log('response: ', response);
      setSchedules(response.data)
    }).catch((error) => {
      console.log('error: ', error);
    })
  }, [date])

  return (
    <div className='container'>
      <Header />
      <div className={style.dataTitle}>
        <h2>Bem vindo(a), {user.name}</h2>
        <p>Esta é sua lista de horários {isToday(date) && <span>de hoje,</span>} dia {format(date, 'dd/MM/yyy')}</p>
      </div>
      <h2 className={style.nextSchedules}>Próximos Horários</h2>
      <div className={style.schedule}>
        <div className={style.cardWrapper}>
          {schedules.map((schedule, index) => {
            return (
              <Card
                key={index}
                date={schedule.date}
                name={schedule.name}
                id={schedule.id}
                phone={schedule.phone}
              />
            )
          })}
        </div>
        <div className={style.picker}>
          <DayPicker
            className={style.calendar}
            classNames={{ day: style.day }}
            selected={date}
            modifiers={{ available: isWeekDay }}
            mode='single'
            modifiersClassNames={{ selected: style.selected }}
            fromMonth={new Date()}
            locale={ptBR}
            disabled={isWeekend}
            onDayClick={handleDateChange}
          />
        </div>
      </div>
    </div>
  )
}

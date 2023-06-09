import { db } from 'src/lib/db'

export const createUser = async ({ input }) => {
  const {
    name,
    email,
    hashedPassword,
    salt,
    resetToken,
    resetTokenExpiresAt,
    newsGeneral,
    newsBusiness,
    newsEntertainment,
    newsHealth,
    newsScience,
    newsSports,
    newsTechnology,
    icon,
  } = input

  return await db.user.create({
    data: {
      name,
      email,
      hashedPassword,
      salt,
      resetToken,
      resetTokenExpiresAt,
      newsGeneral,
      newsBusiness,
      newsEntertainment,
      newsHealth,
      newsScience,
      newsSports,
      newsTechnology,
      icon,
    },
  })
}

export const updateUser = async ({ id, input }) => {
  const {
    name,
    email,
    hashedPassword,
    salt,
    resetToken,
    resetTokenExpiresAt,
    newsGeneral,
    newsBusiness,
    newsEntertainment,
    newsHealth,
    newsScience,
    newsSports,
    newsTechnology,
    icon,
  } = input

  return await db.user.update({
    where: { id },
    data: {
      name,
      email,
      hashedPassword,
      salt,
      resetToken,
      resetTokenExpiresAt,
      newsGeneral,
      newsBusiness,
      newsEntertainment,
      newsHealth,
      newsScience,
      newsSports,
      newsTechnology,
      icon,
    },
  })
}

export const fetchUserbyId = async ({ id }) => {
  return db.user.findUnique({ where: { id: id } })
}

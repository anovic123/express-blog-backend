import { Router } from 'express'

import { container } from './composition-root'

import { TestingController } from './controllers/testing.controller'

const testingController = container.resolve<TestingController>(TestingController)

export const testingRouter = Router({})

testingRouter.delete('/all-data', testingController.deleteAllData.bind(testingController))
import { Router } from "express";
import { stringToOid } from "../data/typecheck.js";
import { createEvent, getEvent, updateEvent } from "../data/events.js";
const router = Router();

router
  .route("/")
  .get(async (req, res) => {
    try {
      return res.json(await getAll());
    } catch (e) {
      if (!e.status) {
        console.log(e);
        return res
          .status(500)
          .json({ status: 500, error: "An Internal Server Error Occurred" });
      }
      return res.status(e.status).json(e);
    }
  })
  .post(async (req, res) => {
    try {
      const expectedKeys = ["eventName", "eventName", "eventType"];
      const params = [];
      expectedKeys.forEach((key) => {
        if (!Object.keys(req.body).includes(key))
          throw { status: 400, error: `Field '${key}' missing` };
        params.push(req.body[key]);
      });

      const createdEvent = await createEvent(...params);
      return res.json(createdEvent);
    } catch (e) {
      if (!e.status) {
        console.log(e);
        return res
          .status(500)
          .json({ status: 500, error: "An Internal Server Error Occurred" });
      }
    }
  });

router
  .route("/:id")
  .get(async (req, res) => {
    try {
      let event = await getEvent(req.params.id);
      return res.json(event);
    } catch (e) {
      if (!e.status) {
        console.log(e);
        return res
          .status(500)
          .json({ status: 500, error: "An Internal Server Error Occurred" });
      }
      return res.status(e.status).json(e);
    }
  })
  .patch(async (req, res) => {
    try {
      let event = await updateEvent(req.params.id, req.body);
      return res.json(event);
    } catch (e) {
      if (!e.status) {
        console.log(e);
        return res
          .status(500)
          .json({ status: 500, error: "An Internal Server Error Occurred" });
      }
      return res.status(e.status).json(e);
    }
  });
